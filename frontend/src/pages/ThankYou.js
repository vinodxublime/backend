import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FiCheckCircle, FiTruck, FiMail, FiShoppingBag } from 'react-icons/fi';
import { motion } from 'framer-motion';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 4rem 20px;
  text-align: center;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const SuccessIcon = styled(motion.div)`
  font-size: 4rem;
  color: #28a745;
  margin-bottom: 2rem;
  
  svg {
    width: 100px;
    height: 100px;
  }
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 3rem;
  line-height: 1.6;
`;

const OrderInfo = styled.div`
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 3rem;
  text-align: left;
`;

const OrderNumber = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #333;
`;

const OrderDetail = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  &:last-child {
    margin-bottom: 0;
    padding-top: 1rem;
    border-top: 1px solid #e9ecef;
    font-weight: 600;
  }
`;

const InfoSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const InfoCard = styled.div`
  background: #fff;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
`;

const InfoIcon = styled.div`
  font-size: 2rem;
  color: #007bff;
  margin-bottom: 1rem;
`;

const InfoTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const InfoText = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Button = styled(Link)`
  display: inline-block;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &.primary {
    background: #000;
    color: #fff;
    
    &:hover {
      background: #333;
      transform: translateY(-2px);
    }
  }
  
  &.secondary {
    background: #fff;
    color: #333;
    border: 2px solid #e9ecef;
    
    &:hover {
      border-color: #000;
    }
  }
`;

const ThankYou = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get order data from navigation state
  const order = location.state?.order;
  const orderNumber = location.state?.orderNumber;

  // If no order data, redirect to home
  React.useEffect(() => {
    if (!order && !orderNumber) {
      navigate('/', { replace: true });
    }
  }, [order, orderNumber, navigate]);

  if (!order && !orderNumber) {
    return null;
  }

  return (
    <Container>
      <Helmet>
        <title>Thank You - Order Confirmed - StyleHub</title>
        <meta name="description" content="Your order has been successfully placed. Thank you for shopping with StyleHub." />
      </Helmet>

      <SuccessIcon
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <FiCheckCircle />
      </SuccessIcon>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Title>Thank You for Your Order!</Title>
        <Subtitle>
          We've received your order and will send you a confirmation email shortly. 
          Your items will be carefully prepared and shipped to you soon.
        </Subtitle>

        {order && (
          <OrderInfo>
            <OrderNumber>
              Order #{order.orderNumber || orderNumber}
            </OrderNumber>
            
            <OrderDetail>
              <span>Order Date:</span>
              <span>{new Date(order.createdAt || Date.now()).toLocaleDateString()}</span>
            </OrderDetail>
            
            <OrderDetail>
              <span>Items:</span>
              <span>{order.items?.length || 0} item(s)</span>
            </OrderDetail>
            
            <OrderDetail>
              <span>Shipping to:</span>
              <span>{order.shippingAddress?.city}, {order.shippingAddress?.state}</span>
            </OrderDetail>
            
            <OrderDetail>
              <span>Total Amount:</span>
              <span>${order.total?.toFixed(2) || '0.00'}</span>
            </OrderDetail>
          </OrderInfo>
        )}

        <InfoSection>
          <InfoCard>
            <InfoIcon>
              <FiMail />
            </InfoIcon>
            <InfoTitle>Email Confirmation</InfoTitle>
            <InfoText>
              We've sent a confirmation email with your order details and tracking information.
            </InfoText>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <FiTruck />
            </InfoIcon>
            <InfoTitle>Shipping & Delivery</InfoTitle>
            <InfoText>
              Your order will be processed within 1-2 business days and shipped via our standard delivery.
            </InfoText>
          </InfoCard>

          <InfoCard>
            <InfoIcon>
              <FiShoppingBag />
            </InfoIcon>
            <InfoTitle>Track Your Order</InfoTitle>
            <InfoText>
              You can track your order status and view details in your account dashboard.
            </InfoText>
          </InfoCard>
        </InfoSection>

        <ActionButtons>
          <Button to="/orders" className="primary">
            View Order Details
          </Button>
          <Button to="/products" className="secondary">
            Continue Shopping
          </Button>
        </ActionButtons>
      </motion.div>
    </Container>
  );
};

export default ThankYou;