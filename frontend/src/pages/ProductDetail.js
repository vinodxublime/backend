import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FiStar, FiHeart, FiShare2, FiMinus, FiPlus } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import ProductCard from '../components/ProductCard';

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 20px;
`;

const Breadcrumb = styled.nav`
  margin-bottom: 2rem;
  font-size: 14px;
  color: #666;

  a {
    color: #666;
    text-decoration: none;

    &:hover {
      color: #000;
    }
  }

  span {
    margin: 0 0.5rem;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ImageGallery = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const MainImage = styled.div`
  aspect-ratio: 1;
  border-radius: 12px;
  overflow: hidden;
  background: #f8f9fa;
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  color: #ddd;
`;

const ThumbnailContainer = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding: 0.5rem 0;
`;

const Thumbnail = styled.div`
  flex-shrink: 0;
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${props => props.active ? '#000' : 'transparent'};
  transition: all 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &:hover {
    border-color: #000;
  }
`;

const ProductInfo = styled.div`
  padding: 1rem 0;
`;

const ProductBrand = styled.p`
  font-size: 1rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 0.5rem;
`;

const ProductTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StarContainer = styled.div`
  display: flex;
  gap: 2px;
`;

const Star = styled(FiStar)`
  fill: ${props => props.filled ? '#feca57' : 'none'};
  color: #feca57;
  font-size: 18px;
`;

const RatingText = styled.span`
  color: #666;
  font-size: 14px;
`;

const PriceContainer = styled.div`
  margin-bottom: 2rem;
`;

const Price = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: #000;
  margin-bottom: 0.5rem;
`;

const OriginalPrice = styled.span`
  font-size: 1.5rem;
  color: #999;
  text-decoration: line-through;
  margin-left: 1rem;
`;

const SaveAmount = styled.div`
  color: #27ae60;
  font-weight: 600;
`;

const Description = styled.div`
  margin-bottom: 2rem;
  line-height: 1.6;
  color: #666;
`;

const OptionsContainer = styled.div`
  margin-bottom: 2rem;
`;

const OptionGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const OptionLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const SizeOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const SizeOption = styled.button`
  padding: 8px 16px;
  border: 2px solid ${props => props.selected ? '#000' : '#e9ecef'};
  background: ${props => props.selected ? '#000' : '#fff'};
  color: ${props => props.selected ? '#fff' : '#333'};
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    border-color: #000;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ColorOptions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

const ColorOption = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 3px solid ${props => props.selected ? '#000' : '#e9ecef'};
  background: ${props => props.color || '#f8f9fa'};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    border-color: #000;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: ${props => props.color || '#f8f9fa'};
  }
`;

const QuantityContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const QuantitySelector = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  padding: 10px 12px;
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
  width: 60px;
  padding: 10px 8px;
  text-align: center;
  border: none;
  font-weight: 600;

  &:focus {
    outline: none;
  }
`;

const StockInfo = styled.div`
  color: ${props => props.inStock ? '#27ae60' : '#e74c3c'};
  font-weight: 600;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const AddToCartButton = styled.button`
  flex: 1;
  padding: 16px 24px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

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

const WishlistButton = styled.button`
  padding: 16px;
  background: #fff;
  color: #333;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #000;
    color: #000;
  }
`;

const ShareButton = styled.button`
  padding: 16px;
  background: #fff;
  color: #333;
  border: 2px solid #e9ecef;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #000;
    color: #000;
  }
`;

const TabContainer = styled.div`
  margin-top: 4rem;
`;

const TabHeaders = styled.div`
  display: flex;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 2rem;
`;

const TabHeader = styled.button`
  padding: 1rem 2rem;
  background: none;
  border: none;
  border-bottom: 2px solid ${props => props.active ? '#000' : 'transparent'};
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    color: #000;
  }
`;

const TabContent = styled.div`
  min-height: 200px;
`;

const ReviewsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Review = styled.div`
  padding: 1.5rem;
  border: 1px solid #e9ecef;
  border-radius: 8px;
`;

const ReviewHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const RelatedProducts = styled.section`
  margin-top: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2rem;
  color: #333;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400px;
  font-size: 1.2rem;
`;

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    if (id) {
      fetchProduct();
      fetchRelatedProducts();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`/api/products/${id}`);
      setProduct(response.data);
      
      // Set default selections
      if (response.data.sizes?.length > 0) {
        setSelectedSize(response.data.sizes[0].size);
      }
      if (response.data.colors?.length > 0) {
        setSelectedColor(response.data.colors[0]);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async () => {
    try {
      const response = await axios.get(`/api/products/${id}/related`);
      setRelatedProducts(response.data);
    } catch (error) {
      console.error('Error fetching related products:', error);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    const requiredSize = product.sizes?.length > 0;
    const requiredColor = product.colors?.length > 0;

    if (requiredSize && !selectedSize) {
      toast.error('Please select a size');
      return;
    }

    if (requiredColor && !selectedColor) {
      toast.error('Please select a color');
      return;
    }

    addToCart(product, quantity, selectedSize, selectedColor);
    toast.success(`${product.name} added to cart!`);
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star key={index} filled={index < Math.floor(rating)} />
    ));
  };

  if (loading) {
    return <LoadingContainer>Loading product...</LoadingContainer>;
  }

  if (!product) {
    return (
      <Container>
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <h2>Product not found</h2>
          <Link to="/products" className="btn">
            Browse Products
          </Link>
        </div>
      </Container>
    );
  }

  const isOnSale = product.originalPrice && product.originalPrice > product.price;
  const saveAmount = isOnSale ? product.originalPrice - product.price : 0;

  return (
    <Container>
      <Helmet>
        <title>{product.name} - StyleHub</title>
        <meta name="description" content={product.description} />
      </Helmet>

      <Breadcrumb>
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <Link to={`/products/${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span>{product.name}</span>
      </Breadcrumb>

      <ProductContainer>
        <ImageGallery>
          <MainImage>
            {product.images?.length > 0 ? (
              <ProductImage 
                src={product.images[activeImageIndex]?.url} 
                alt={product.name} 
              />
            ) : (
              <PlaceholderImage>📷</PlaceholderImage>
            )}
          </MainImage>
          
          {product.images?.length > 1 && (
            <ThumbnailContainer>
              {product.images.map((image, index) => (
                <Thumbnail
                  key={index}
                  active={index === activeImageIndex}
                  onClick={() => setActiveImageIndex(index)}
                >
                  <img src={image.url} alt={`${product.name} ${index + 1}`} />
                </Thumbnail>
              ))}
            </ThumbnailContainer>
          )}
        </ImageGallery>

        <ProductInfo>
          <ProductBrand>{product.brand}</ProductBrand>
          <ProductTitle>{product.name}</ProductTitle>
          
          {product.rating?.average > 0 && (
            <Rating>
              <StarContainer>
                {renderStars(product.rating.average)}
              </StarContainer>
              <RatingText>
                {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
              </RatingText>
            </Rating>
          )}

          <PriceContainer>
            <Price>
              ${product.price}
              {isOnSale && <OriginalPrice>${product.originalPrice}</OriginalPrice>}
            </Price>
            {isOnSale && (
              <SaveAmount>Save ${saveAmount.toFixed(2)}</SaveAmount>
            )}
          </PriceContainer>

          <Description>
            {product.description}
          </Description>

          <OptionsContainer>
            {product.sizes?.length > 0 && (
              <OptionGroup>
                <OptionLabel>Size</OptionLabel>
                <SizeOptions>
                  {product.sizes.map((sizeObj) => (
                    <SizeOption
                      key={sizeObj.size}
                      selected={selectedSize === sizeObj.size}
                      onClick={() => setSelectedSize(sizeObj.size)}
                      disabled={sizeObj.stock === 0}
                    >
                      {sizeObj.size}
                    </SizeOption>
                  ))}
                </SizeOptions>
              </OptionGroup>
            )}

            {product.colors?.length > 0 && (
              <OptionGroup>
                <OptionLabel>Color</OptionLabel>
                <ColorOptions>
                  {product.colors.map((color) => (
                    <ColorOption
                      key={color}
                      color={color.toLowerCase()}
                      selected={selectedColor === color}
                      onClick={() => setSelectedColor(color)}
                      title={color}
                    />
                  ))}
                </ColorOptions>
              </OptionGroup>
            )}
          </OptionsContainer>

          <QuantityContainer>
            <div>
              <OptionLabel>Quantity</OptionLabel>
              <QuantitySelector>
                <QuantityButton 
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                >
                  <FiMinus />
                </QuantityButton>
                <QuantityInput
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                  min="1"
                  max={product.stock}
                />
                <QuantityButton 
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                >
                  <FiPlus />
                </QuantityButton>
              </QuantitySelector>
            </div>
            
            <StockInfo inStock={product.stock > 0}>
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </StockInfo>
          </QuantityContainer>

          <ActionButtons>
            <AddToCartButton 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </AddToCartButton>
            
            <WishlistButton onClick={() => toast.info('Wishlist feature coming soon!')}>
              <FiHeart size={20} />
            </WishlistButton>
            
            <ShareButton onClick={() => toast.info('Share feature coming soon!')}>
              <FiShare2 size={20} />
            </ShareButton>
          </ActionButtons>
        </ProductInfo>
      </ProductContainer>

      <TabContainer>
        <TabHeaders>
          <TabHeader 
            active={activeTab === 'description'}
            onClick={() => setActiveTab('description')}
          >
            Description
          </TabHeader>
          <TabHeader 
            active={activeTab === 'reviews'}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({product.rating?.count || 0})
          </TabHeader>
          <TabHeader 
            active={activeTab === 'shipping'}
            onClick={() => setActiveTab('shipping')}
          >
            Shipping & Returns
          </TabHeader>
        </TabHeaders>

        <TabContent>
          {activeTab === 'description' && (
            <div>
              <h3>Product Details</h3>
              <p>{product.description}</p>
              {product.tags?.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <strong>Tags: </strong>
                  {product.tags.join(', ')}
                </div>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <ReviewsContainer>
              {product.reviews?.length > 0 ? (
                product.reviews.map((review, index) => (
                  <Review key={index}>
                    <ReviewHeader>
                      <strong>{review.user?.name || 'Anonymous'}</strong>
                      <div>
                        {renderStars(review.rating)}
                      </div>
                    </ReviewHeader>
                    <p>{review.comment}</p>
                    <small style={{ color: '#666' }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </Review>
                ))
              ) : (
                <p>No reviews yet. Be the first to review this product!</p>
              )}
            </ReviewsContainer>
          )}

          {activeTab === 'shipping' && (
            <div>
              <h3>Shipping Information</h3>
              <p>• Free shipping on orders over $100</p>
              <p>• Standard shipping: 3-5 business days</p>
              <p>• Express shipping: 1-2 business days</p>
              <p>• International shipping available</p>
              
              <h3 style={{ marginTop: '2rem' }}>Return Policy</h3>
              <p>• 30-day return policy</p>
              <p>• Items must be unworn and in original condition</p>
              <p>• Free returns for defective items</p>
            </div>
          )}
        </TabContent>
      </TabContainer>

      {relatedProducts.length > 0 && (
        <RelatedProducts>
          <SectionTitle>You Might Also Like</SectionTitle>
          <ProductGrid>
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct._id} product={relatedProduct} />
            ))}
          </ProductGrid>
        </RelatedProducts>
      )}
    </Container>
  );
};

export default ProductDetail;