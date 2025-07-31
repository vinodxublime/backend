import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FiEye, FiEyeOff } from 'react-icons/fi';
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

const InputContainer = styled.div`
  position: relative;
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

const PasswordToggle = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
  padding: 4px;

  &:hover {
    color: #000;
  }
`;

const ErrorMessage = styled.span`
  color: #dc3545;
  font-size: 14px;
  margin-top: 0.25rem;
`;

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
  font-size: 12px;
  display: flex;
  gap: 2px;
`;

const StrengthBar = styled.div`
  flex: 1;
  height: 4px;
  background: ${props => props.active ? props.color : '#e9ecef'};
  border-radius: 2px;
`;

const StrengthText = styled.span`
  margin-top: 0.25rem;
  font-size: 12px;
  color: ${props => props.color};
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

const ResetPassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract token from URL query parameters
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get('token');
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm({
    defaultValues: {
      password: '',
      confirmPassword: ''
    },
    mode: 'onBlur'
  });

  const password = watch('password');

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, color: '#dc3545', text: 'Weak' };
    
    let strength = 0;
    let color = '#dc3545';
    let text = 'Weak';

    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    if (strength >= 4) {
      color = '#28a745';
      text = 'Strong';
    } else if (strength >= 2) {
      color = '#ffc107';
      text = 'Medium';
    }

    return { strength, color, text };
  };

  const onSubmit = async (data) => {
    if (!token) {
      toast.error('Invalid or missing reset token');
      return;
    }

    setLoading(true);
    
    try {
      const result = await resetPassword(token, data.password);
      
      if (result.success) {
        setResetSuccess(true);
        toast.success('Password has been reset successfully');
      } else {
        toast.error(result.message || 'Failed to reset password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  if (!token) {
    return (
      <Container>
        <Helmet>
          <title>Invalid Reset Link - Learning Platform</title>
          <meta name="description" content="Reset your password for Learning Platform" />
        </Helmet>

        <FormContainer>
          <Title>Invalid Reset Link</Title>
          <Subtitle>The password reset link is invalid or has expired.</Subtitle>
          <LoginPrompt>
            <Link to="/forgot-password">Request a new password reset link</Link>
          </LoginPrompt>
        </FormContainer>
      </Container>
    );
  }

  return (
    <Container>
      <Helmet>
        <title>Reset Password - Learning Platform</title>
        <meta name="description" content="Reset your password for Learning Platform" />
      </Helmet>

      <FormContainer>
        <Title>Reset Password</Title>
        <Subtitle>Create a new password for your account</Subtitle>

        {resetSuccess ? (
          <>
            <SuccessMessage>
              Your password has been reset successfully.
            </SuccessMessage>
            <LoginPrompt>
              <Link to="/login">Sign in with your new password</Link>
            </LoginPrompt>
          </>
        ) : (
          <>
            <Form onSubmit={handleSubmit(onSubmit)}>
              <FormGroup>
                <Label htmlFor="password">New Password</Label>
                <InputContainer>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className={errors.password ? 'error' : ''}
                    placeholder="Create a new password"
                    autoComplete="new-password"
                    {...register('password', { 
                      required: 'Password is required',
                      minLength: {
                        value: 6,
                        message: 'Password must be at least 6 characters'
                      }
                    })}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </PasswordToggle>
                </InputContainer>
                {password && (
                  <PasswordStrength>
                    {Array.from({ length: 5 }, (_, i) => (
                      <StrengthBar
                        key={i}
                        active={i < passwordStrength.strength}
                        color={passwordStrength.color}
                      />
                    ))}
                  </PasswordStrength>
                )}
                {password && (
                  <StrengthText color={passwordStrength.color}>
                    Password strength: {passwordStrength.text}
                  </StrengthText>
                )}
                {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
              </FormGroup>

              <FormGroup>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <InputContainer>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="Confirm your new password"
                    autoComplete="new-password"
                    {...register('confirmPassword', { 
                      required: 'Please confirm your password',
                      validate: value => value === password || 'Passwords do not match'
                    })}
                  />
                  <PasswordToggle
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </PasswordToggle>
                </InputContainer>
                {errors.confirmPassword && <ErrorMessage>{errors.confirmPassword.message}</ErrorMessage>}
              </FormGroup>

              <SubmitButton type="submit" disabled={loading}>
                {loading ? 'Resetting Password...' : 'Reset Password'}
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

export default ResetPassword;