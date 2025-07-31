import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem 20px;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const FormContainer = styled.div`
  background: #fff;
  padding: 3rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #333;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #666;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
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

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 14px;
  margin-top: 0.25rem;
`;

const SubmitButton = styled.button`
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

const LoginPrompt = styled.div`
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #e9ecef;
  color: #666;

  a {
    color: #000;
    text-decoration: none;
    font-weight: 600;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const SuccessMessage = styled.div`
  background-color: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ForgotPassword = () => {
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { forgotPassword } = useAuth();
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      email: ''
    },
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const result = await forgotPassword(data.email);
      
      if (result.success) {
        setEmailSent(true);
        toast.success('Password reset instructions sent to your email');
      } else {
        toast.error(result.message || 'Failed to send reset email');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Helmet>
        <title>Forgot Password - Learning Platform</title>
        <meta name="description" content="Reset your password for Learning Platform" />
      </Helmet>

      <FormContainer>
        <Title>Forgot Password</Title>
        <Subtitle>Enter your email to receive password reset instructions</Subtitle>

        {emailSent ? (
          <>
            <SuccessMessage>
              We've sent password reset instructions to your email. Please check your inbox.
            </SuccessMessage>
            <LoginPrompt>
              <Link to="/login">Return to Login</Link>
            </LoginPrompt>
          </>
        ) : (
          <>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  type="email"
                  id="email"
                  className={errors.email ? 'error' : ''}
                  placeholder="Enter your email"
                  autoComplete="email"
                  {...register('email', { 
                    required: 'Email is required', 
                    pattern: {
                      value: /\S+@\S+\.\S+/,
                      message: 'Email is invalid'
                    }
                  })}
                />
                {errors.email && <ErrorMessage>{errors.email.message}</ErrorMessage>}
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Sending...' : 'Send Reset Instructions'}
              </SubmitButton>
            </Form>

            <LoginPrompt>
              Remember your password?{' '}
              <Link to="/login">
                Sign in here
              </Link>
            </LoginPrompt>
          </>
        )}
      </FormContainer>
    </Container>
  );
};

export default ForgotPassword;