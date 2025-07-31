import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FiPackage, FiTruck, FiCheckCircle, FiClock, FiX } from 'react-icons/fi';
import axios from 'axios';
import { toast } from 'react-toastify';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 20px;
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

const OrdersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const OrderCard = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  border: 1px solid #e9ecef;
`;

const OrderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e9ecef;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const OrderInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const OrderNumber = styled.h3`
  font-size: 1.2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const OrderDate = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin: 0;
`;

const OrderTotal = styled.div`
  font-size: 1.2rem;
  font-weight: 700;
  color: #000;
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => {
    switch (props.status) {
      case 'pending':
        return 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;';
      case 'confirmed':
        return 'background: #cce5ff; color: #004085; border: 1px solid #74c0fc;';
      case 'processing':
        return 'background: #e2e3ff; color: #3730a3; border: 1px solid #a5b4fc;';
      case 'shipped':
        return 'background: #d4edda; color: #155724; border: 1px solid #81c784;';
      case 'delivered':
        return 'background: #d1ecf1; color: #0c5460; border: 1px solid #4dd0e1;';
      case 'cancelled':
        return 'background: #f8d7da; color: #721c24; border: 1px solid #f28b82;';
      default:
        return 'background: #f8f9fa; color: #6c757d; border: 1px solid #dee2e6;';
    }
  }}
`;

const getStatusIcon = (status) => {
  switch (status) {
    case 'pending':
      return <FiClock />;
    case 'confirmed':
    case 'processing':
      return <FiPackage />;
    case 'shipped':
      return <FiTruck />;
    case 'delivered':
      return <FiCheckCircle />;
    case 'cancelled':
      return <FiX />;
    default:
      return <FiPackage />;
  }
};

const OrderItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const OrderItem = styled.div`
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ItemImage = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  overflow: hidden;
  background: #fff;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
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
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ItemName = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem 0;
`;

const ItemDetails = styled.p`
  font-size: 0.9rem;
  color: #666;
  margin: 0;
`;

const ItemPrice = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  font-weight: 600;
  color: #000;
`;

const OrderActions = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #e9ecef;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ActionButton = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  
  &.primary {
    background: #000;
    color: #fff;
    
    &:hover {
      background: #333;
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

  &.danger {
    background: #dc3545;
    color: #fff;
    
    &:hover {
      background: #c82333;
    }
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
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

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  font-size: 1.2rem;
`;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders/my-orders');
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await axios.patch(`/api/orders/${orderId}/cancel`);
      toast.success('Order cancelled successfully');
      fetchOrders(); // Refresh the orders list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel order');
    }
  };

  const canCancelOrder = (order) => {
    return order.orderStatus === 'pending' || order.orderStatus === 'confirmed';
  };

  if (loading) {
    return (
      <Container>
        <LoadingContainer>Loading your orders...</LoadingContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>My Orders - StyleHub</title>
        <meta name="description" content="View your order history and track your purchases from StyleHub" />
      </Helmet>

      <Header>
        <Title>My Orders</Title>
        <Subtitle>Track your orders and view your purchase history</Subtitle>
      </Header>

      {orders.length === 0 ? (
        <EmptyState>
          <FiPackage />
          <h3>No orders yet</h3>
          <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <Link to="/products" className="btn">
            Start Shopping
          </Link>
        </EmptyState>
      ) : (
        <OrdersContainer>
          {orders.map((order) => (
            <OrderCard key={order._id}>
              <OrderHeader>
                <OrderInfo>
                  <OrderNumber>Order #{order.orderNumber}</OrderNumber>
                  <OrderDate>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </OrderDate>
                </OrderInfo>
                
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                  <OrderTotal>${order.total.toFixed(2)}</OrderTotal>
                  <StatusBadge status={order.orderStatus}>
                    {getStatusIcon(order.orderStatus)}
                    {order.orderStatus}
                  </StatusBadge>
                </div>
              </OrderHeader>

              <OrderItems>
                {order.items.map((item, index) => (
                  <OrderItem key={index}>
                    <ItemImage>
                      {item.product?.images?.[0]?.url ? (
                        <img src={item.product.images[0].url} alt={item.product.name} />
                      ) : (
                        <PlaceholderImage>📷</PlaceholderImage>
                      )}
                    </ItemImage>
                    
                    <ItemInfo>
                      <ItemName>{item.product?.name || 'Product'}</ItemName>
                      <ItemDetails>
                        {item.size && `Size: ${item.size}`}
                        {item.size && item.color && ' • '}
                        {item.color && `Color: ${item.color}`}
                        <br />
                        Quantity: {item.quantity}
                      </ItemDetails>
                      <ItemPrice>
                        <span>Unit Price: ${item.price}</span>
                        <span>Total: ${(item.price * item.quantity).toFixed(2)}</span>
                      </ItemPrice>
                    </ItemInfo>
                  </OrderItem>
                ))}
              </OrderItems>

              <OrderActions>
                <Link to={`/order/${order._id}`}>
                  <ActionButton className="primary">
                    View Details
                  </ActionButton>
                </Link>
                
                {order.trackingNumber && (
                  <ActionButton className="secondary">
                    Track Package
                  </ActionButton>
                )}
                
                {order.orderStatus === 'delivered' && (
                  <ActionButton className="secondary">
                    Leave Review
                  </ActionButton>
                )}
                
                {canCancelOrder(order) && (
                  <ActionButton 
                    className="danger"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    Cancel Order
                  </ActionButton>
                )}
              </OrderActions>
            </OrderCard>
          ))}
        </OrdersContainer>
      )}
    </Container>
  );
};

export default Orders;