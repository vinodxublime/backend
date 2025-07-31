import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1, size = null, color = null) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(
        item => 
          item.id === product._id && 
          item.size === size && 
          item.color === color
      );

      if (existingItem) {
        return prevItems.map(item =>
          item.id === product._id && item.size === size && item.color === color
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prevItems, {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0]?.url || '',
          quantity,
          size,
          color,
          stock: product.stock
        }];
      }
    });
  };

  const removeFromCart = (id, size = null, color = null) => {
    setCartItems(prevItems =>
      prevItems.filter(
        item => !(item.id === id && item.size === size && item.color === color)
      )
    );
  };

  const updateQuantity = (id, quantity, size = null, color = null) => {
    if (quantity <= 0) {
      removeFromCart(id, size, color);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const openCart = () => {
    setIsOpen(true);
  };

  const closeCart = () => {
    setIsOpen(false);
  };

  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    isOpen,
    openCart,
    closeCart,
    toggleCart
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};