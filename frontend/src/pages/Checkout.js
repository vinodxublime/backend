import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FiCreditCard, FiTruck, FiLock } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Container = styled.div`
  max-width: 1200px;
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

const CheckoutContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const CheckoutForm = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

const Section = styled.div`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e9ecef;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #000;
  }

  &.error {
    border-color: #dc3545;
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s ease;
  background: white;

  &:focus {
    outline: none;
    border-color: #000;
  }

  &.error {
    border-color: #dc3545;
  }
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 14px;
  margin-top: 0.25rem;
`;

const PaymentOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PaymentOption = styled.div`
  border: 2px solid ${props => props.selected ? '#000' : '#e9ecef'};
  border-radius: 8px;
  padding: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;

  &:hover {
    border-color: #000;
  }
`;

const OrderSummary = styled.div`
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

const OrderItem = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f8f9fa;

  &:last-child {
    border-bottom: none;
    margin-bottom: 0;
  }
`;

const ItemImage = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  background: #f8f9fa;
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const PlaceholderImage = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: #ddd;
`;

const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: #333;
  margin-bottom: 0.25rem;
`;

const ItemDetails = styled.div`
  font-size: 0.9rem;
  color: #666;
`;

const ItemPrice = styled.div`
  font-weight: 600;
  color: #000;
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 0.5rem 0;

  &.total {
    margin-bottom: 0;
    padding-top: 1rem;
    border-top: 2px solid #e9ecef;
    font-weight: 700;
    font-size: 1.2rem;
  }
`;

const PlaceOrderButton = styled.button`
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

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

const SecurityBadge = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: #666;
  font-size: 0.9rem;
`;

const Checkout = () => {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // Shipping Info
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    zipCode: user?.address?.zipCode || '',
    country: user?.address?.country || 'United States',
    
    // Payment Info
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
    
    // Billing Address
    billingAddress: '',
    billingCity: '',
    billingState: '',
    billingZipCode: '',
    billingCountry: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [sameBillingAddress, setSameBillingAddress] = useState(true);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Shipping validation
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.phone) newErrors.phone = 'Phone is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.zipCode) newErrors.zipCode = 'ZIP code is required';

    // Payment validation
    if (paymentMethod === 'credit_card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.expiryDate) newErrors.expiryDate = 'Expiry date is required';
      if (!formData.cvv) newErrors.cvv = 'CVV is required';
      if (!formData.cardName) newErrors.cardName = 'Cardholder name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      const orderData = {
        items: cartItems.map(item => ({
          productId: item.id,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
          price: item.price
        })),
        shippingAddress: {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
          phone: formData.phone
        },
        billingAddress: sameBillingAddress ? {
          name: `${formData.firstName} ${formData.lastName}`,
          street: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        } : {
          name: formData.cardName,
          street: formData.billingAddress,
          city: formData.billingCity,
          state: formData.billingState,
          zipCode: formData.billingZipCode,
          country: formData.billingCountry
        },
        paymentMethod
      };

      const response = await axios.post('/api/orders', orderData);
      
      if (response.data.order) {
        clearCart();
        toast.success('Order placed successfully!');
        navigate('/thank-you', { 
          state: { 
            order: response.data.order,
            orderNumber: response.data.order.orderNumber 
          } 
        });
      }
    } catch (error) {
      console.error('Order error:', error);
      toast.error(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 100 ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  return (
    <Container>
      <Helmet>
        <title>Checkout - StyleHub</title>
        <meta name="description" content="Complete your order securely with StyleHub" />
      </Helmet>

      <Header>
        <Title>Checkout</Title>
        <Subtitle>Complete your order securely</Subtitle>
      </Header>

      <CheckoutContent>
        <CheckoutForm>
          <Form onSubmit={handleSubmit}>
            <Section>
              <SectionTitle>
                <FiTruck /> Shipping Information
              </SectionTitle>
              
              <FormRow>
                <FormGroup>
                  <Label>First Name *</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={errors.firstName ? 'error' : ''}
                  />
                  {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>Last Name *</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={errors.lastName ? 'error' : ''}
                  />
                  {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>Email *</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>Phone *</Label>
                  <Input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormGroup>
                <Label>Address *</Label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Street address"
                />
                {errors.address && <ErrorMessage>{errors.address}</ErrorMessage>}
              </FormGroup>

              <FormRow>
                <FormGroup>
                  <Label>City *</Label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className={errors.city ? 'error' : ''}
                  />
                  {errors.city && <ErrorMessage>{errors.city}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>State *</Label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className={errors.state ? 'error' : ''}
                  />
                  {errors.state && <ErrorMessage>{errors.state}</ErrorMessage>}
                </FormGroup>
              </FormRow>

              <FormRow>
                <FormGroup>
                  <Label>ZIP Code *</Label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    className={errors.zipCode ? 'error' : ''}
                  />
                  {errors.zipCode && <ErrorMessage>{errors.zipCode}</ErrorMessage>}
                </FormGroup>
                
                <FormGroup>
                  <Label>Country *</Label>
                  <Select
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </Select>
                </FormGroup>
              </FormRow>
            </Section>

            <Section>
              <SectionTitle>
                <FiCreditCard /> Payment Method
              </SectionTitle>
              
              <PaymentOptions>
                <PaymentOption
                  selected={paymentMethod === 'credit_card'}
                  onClick={() => setPaymentMethod('credit_card')}
                >
                  <FiCreditCard size={24} />
                  <div>Credit Card</div>
                </PaymentOption>
                
                <PaymentOption
                  selected={paymentMethod === 'paypal'}
                  onClick={() => setPaymentMethod('paypal')}
                >
                  <div style={{ fontSize: '20px' }}>💳</div>
                  <div>PayPal</div>
                </PaymentOption>
              </PaymentOptions>

              {paymentMethod === 'credit_card' && (
                <>
                  <FormGroup style={{ marginTop: '1.5rem' }}>
                    <Label>Cardholder Name *</Label>
                    <Input
                      type="text"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      className={errors.cardName ? 'error' : ''}
                    />
                    {errors.cardName && <ErrorMessage>{errors.cardName}</ErrorMessage>}
                  </FormGroup>

                  <FormGroup>
                    <Label>Card Number *</Label>
                    <Input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleChange}
                      className={errors.cardNumber ? 'error' : ''}
                      placeholder="1234 5678 9012 3456"
                    />
                    {errors.cardNumber && <ErrorMessage>{errors.cardNumber}</ErrorMessage>}
                  </FormGroup>

                  <FormRow>
                    <FormGroup>
                      <Label>Expiry Date *</Label>
                      <Input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleChange}
                        className={errors.expiryDate ? 'error' : ''}
                        placeholder="MM/YY"
                      />
                      {errors.expiryDate && <ErrorMessage>{errors.expiryDate}</ErrorMessage>}
                    </FormGroup>
                    
                    <FormGroup>
                      <Label>CVV *</Label>
                      <Input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleChange}
                        className={errors.cvv ? 'error' : ''}
                        placeholder="123"
                      />
                      {errors.cvv && <ErrorMessage>{errors.cvv}</ErrorMessage>}
                    </FormGroup>
                  </FormRow>
                </>
              )}
            </Section>

            <PlaceOrderButton type="submit" disabled={loading}>
              <FiLock />
              {loading ? 'Processing...' : `Place Order - $${total.toFixed(2)}`}
            </PlaceOrderButton>
          </Form>

          <SecurityBadge>
            <FiLock />
            Your payment information is secure and encrypted
          </SecurityBadge>
        </CheckoutForm>

        <OrderSummary>
          <SummaryTitle>Order Summary</SummaryTitle>
          
          {cartItems.map((item) => (
            <OrderItem key={`${item.id}-${item.size}-${item.color}`}>
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
                  <br />
                  Qty: {item.quantity}
                </ItemDetails>
                <ItemPrice>${(item.price * item.quantity).toFixed(2)}</ItemPrice>
              </ItemInfo>
            </OrderItem>
          ))}
          
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #e9ecef' }}>
            <SummaryRow>
              <span>Subtotal</span>
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

            <SummaryRow className="total">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </SummaryRow>
          </div>
        </OrderSummary>
      </CheckoutContent>
    </Container>
  );
};

export default Checkout;