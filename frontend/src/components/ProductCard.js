import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const Card = styled(motion.div)`
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.15);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  aspect-ratio: 1;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #999;
`;

const Badge = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  background: ${props => props.sale ? '#ff4757' : '#2ed573'};
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
`;

const Actions = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  opacity: 0;
  transform: translateX(20px);
  transition: all 0.3s ease;

  ${Card}:hover & {
    opacity: 1;
    transform: translateX(0);
  }
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;

  &:hover {
    background: #000;
    color: white;
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  padding: 1.5rem;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const ProductBrand = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const PriceContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Price = styled.span`
  font-size: 1.2rem;
  font-weight: 700;
  color: #000;
`;

const OriginalPrice = styled.span`
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 1rem;
`;

const StarRating = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled(FiStar)`
  fill: ${props => props.filled ? '#feca57' : 'none'};
  color: #feca57;
  font-size: 14px;
`;

const RatingText = styled.span`
  font-size: 0.9rem;
  color: #666;
  margin-left: 0.25rem;
`;

const AddToCartButton = styled.button`
  width: 100%;
  padding: 12px;
  background: #000;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #333;
    transform: translateY(-1px);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast.info('Wishlist feature coming soon!');
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < Math.floor(rating)} />
    ));
  };

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const imageUrl = product.images?.[0]?.url;

  return (
    <Card
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Link to={`/product/${product._id}`}>
        <ImageContainer>
          {imageUrl ? (
            <ProductImage src={imageUrl} alt={product.name} />
          ) : (
            <PlaceholderImage>📷</PlaceholderImage>
          )}
          
          {(product.featured || isOnSale) && (
            <Badge sale={isOnSale}>
              {isOnSale ? 'Sale' : 'Featured'}
            </Badge>
          )}
          
          <Actions>
            <ActionButton onClick={handleWishlist} title="Add to Wishlist">
              <FiHeart size={18} />
            </ActionButton>
            <ActionButton onClick={handleAddToCart} title="Quick Add to Cart">
              <FiShoppingCart size={18} />
            </ActionButton>
          </Actions>
        </ImageContainer>
        
        <ProductInfo>
          <ProductBrand>{product.brand}</ProductBrand>
          <ProductName>{product.name}</ProductName>
          
          <PriceContainer>
            <Price>${product.price}</Price>
            {isOnSale && (
              <OriginalPrice>${product.originalPrice}</OriginalPrice>
            )}
          </PriceContainer>
          
          {product.rating?.average > 0 && (
            <Rating>
              <StarRating>
                {renderStars(product.rating.average)}
              </StarRating>
              <RatingText>
                {product.rating.average.toFixed(1)} ({product.rating.count})
              </RatingText>
            </Rating>
          )}
          
          <AddToCartButton 
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </AddToCartButton>
        </ProductInfo>
      </Link>
    </Card>
  );
};

export default ProductCard;