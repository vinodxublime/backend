import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
  min-height: 60vh;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Subtitle = styled.p`
  color: #666;
  font-size: 1.1rem;
`;

const CartContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CartItems = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

const CartItem = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr auto auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1.5rem 0;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
  }

  @media (max-width: 768px) {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }
`;

const ItemImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: #ddd;
`;

const ItemInfo = styled.div`
  @media (max-width: 768px) {
    grid-column: 1 / -1;
    margin-top: 1rem;
  }
`;

const ItemName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  color: #333;
`;

const ItemDetails = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.p`
  font-weight: 600;
  color: #000;
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const QuantityButton = styled.button`
  padding: 8px 10px;
  background: #f8f9fa;
  border: none;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #e9ecef;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 50px;
  padding: 8px 4px;
  text-align: center;
  border: none;
  font-weight: 600;

  &:focus {
    outline: none;
  }
`;

const ItemTotal = styled.div`
  font-weight: 700;
  font-size: 1.1rem;
  color: #000;

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const RemoveButton = styled.button`
  padding: 8px;
  background: none;
  border: none;
  color: #dc3545;
  cursor: pointer;
  border-radius: 50%;
  transition: all 0.3s ease;

  &:hover {
    background: #fee;
    transform: scale(1.1);
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
  }
`;

const MobileItemActions = styled.div`
  display: none;
  grid-column: 1 / -1;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const CartSummary = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  height: fit-content;
  position: sticky;
  top: 2rem;
`;

const SummaryTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #333;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;

  &:last-child {
    margin-bottom: 0;
    padding-top: 1rem;
    border-top: 2px solid #e9ecef;
    font-weight: 700;
    font-size: 1.2rem;
  }
`;

const CheckoutButton = styled.button`
  width: 100%;
  padding: 16px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;

  &:hover {
    background: #333;
    transform: translateY(-2px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ContinueShoppingButton = styled(Link)`
  display: inline-block;
  width: 100%;
  text-align: center;
  padding: 12px;
  color: #000;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    border-color: #000;
  }
`;

const EmptyCart = styled.div`
  text-align: center;
  padding: 4rem 2rem;
  color: #666;

  svg {
    font-size: 4rem;
    margin-bottom: 1rem;
    color: #ddd;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: #333;
  }

  p {
    margin-bottom: 2rem;
    font-size: 1.1rem;
  }
`;

const Cart = () => {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, getCartItemsCount } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = (id, newQuantity, size, color) => {
    if (newQuantity <= 0) {
      removeFromCart(id, size, color);
    } else {
      updateQuantity(id, newQuantity, size, color);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  if (cartItems.length === 0) {
    return (
      <Container>
        <Helmet>
          <title>Shopping Cart - StyleHub</title>
          <meta name="description" content="Review and manage your shopping cart items" />
        </Helmet>

        <Header>
          <Title>Shopping Cart</Title>
          <Subtitle>Your cart is currently empty</Subtitle>
        </Header>

        <EmptyCart>
          <FiShoppingBag />
          <h3>Your cart is empty</h3>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/products" className="btn">
            Start Shopping
          </Link>
        </EmptyCart>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>Shopping Cart ({getCartItemsCount()}) - StyleHub</title>
        <meta name="description" content="Review and manage your shopping cart items" />
      </Helmet>

      <Header>
        <Title>Shopping Cart</Title>
        <Subtitle>{getCartItemsCount()} items in your cart</Subtitle>
      </Header>

      <CartContent>
        <CartItems>
          {cartItems.map((item) => (
            <CartItem key={`${item.id}-${item.size}-${item.color}`}>
              <ItemImage>
                {item.image ? (
                  <img src={item.image} alt={item.name} />
                ) : (
                  <PlaceholderImage>📷</PlaceholderImage>
                )}
              </ItemImage>

              <ItemInfo>
                <ItemName>{item.name}</ItemName>
                <ItemDetails>
                  {item.size && `Size: ${item.size}`}
                  {item.size && item.color && ' • '}
                  {item.color && `Color: ${item.color}`}
                </ItemDetails>
                <ItemPrice>${item.price}</ItemPrice>
              </ItemInfo>

              <QuantityContainer className="desktop-only">
                <QuantityButton 
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size, item.color)}
                  disabled={item.quantity <= 1}
                >
                  <FiMinus />
                </QuantityButton>
                <QuantityInput
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1, item.size, item.color)}
                  min="1"
                  max={item.stock}
                />
                <QuantityButton 
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size, item.color)}
                  disabled={item.quantity >= item.stock}
                >
                  <FiPlus />
                </QuantityButton>
              </QuantityContainer>

              <ItemTotal className="desktop-only">
                ${(item.price * item.quantity).toFixed(2)}
              </ItemTotal>

              <RemoveButton 
                className="desktop-only"
                onClick={() => removeFromCart(item.id, item.size, item.color)}
                title="Remove from cart"
              >
                <FiTrash2 size={18} />
              </RemoveButton>

              <MobileItemActions>
                <QuantityContainer>
                  <QuantityButton 
                    onClick={() => handleQuantityChange(item.id, item.quantity - 1, item.size, item.color)}
                    disabled={item.quantity <= 1}
                  >
                    <FiMinus />
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1, item.size, item.color)}
                    min="1"
                    max={item.stock}
                  />
                  <QuantityButton 
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1, item.size, item.color)}
                    disabled={item.quantity >= item.stock}
                  >
                    <FiPlus />
                  </QuantityButton>
                </QuantityContainer>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <ItemTotal>
                    ${(item.price * item.quantity).toFixed(2)}
                  </ItemTotal>
                  <RemoveButton 
                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                    title="Remove from cart"
                  >
                    <FiTrash2 size={18} />
                  </RemoveButton>
                </div>
              </MobileItemActions>
            </CartItem>
          ))}
        </CartItems>

        <CartSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          
          <SummaryRow>
            <span>Subtotal ({getCartItemsCount()} items)</span>
            <span>${subtotal.toFixed(2)}</span>
          </SummaryRow>

          <SummaryRow>
            <span>Shipping</span>
            <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
          </SummaryRow>

          <SummaryRow>
            <span>Tax</span>
            <span>${tax.toFixed(2)}</span>
          </SummaryRow>

          <SummaryRow>
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </SummaryRow>

          {subtotal < 100 && (
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#666', 
              textAlign: 'center', 
              margin: '1rem 0',
              padding: '0.5rem',
              background: '#f8f9fa',
              borderRadius: '4px'
            }}>
              Add ${(100 - subtotal).toFixed(2)} more for free shipping!
            </p>
          )}

          <CheckoutButton onClick={handleCheckout}>
            {isAuthenticated ? 'Proceed to Checkout' : 'Login to Checkout'}
          </CheckoutButton>

          <ContinueShoppingButton to="/products">
            Continue Shopping
          </ContinueShoppingButton>
        </CartSummary>
      </CartContent>

      <style jsx>{`
        @media (min-width: 769px) {
          .mobile-only {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .desktop-only {
            display: none !important;
          }
        }
      `}</style>
    </Container>
  );
};

export default Cart;