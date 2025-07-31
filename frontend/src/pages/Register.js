import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

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

const CheckboxContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
`;

const Checkbox = styled.input`
  margin: 0;
  margin-top: 2px;
`;

const CheckboxLabel = styled.label`
  font-size: 14px;
  line-height: 1.4;
  color: #666;
  cursor: pointer;

  a {
    color: #000;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  &.error {
    color: #dc3545;
  }
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

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/home';

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError,
    clearErrors
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false
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
    if (!data.agreeTerms) {
      setError('agreeTerms', {
        type: 'manual',
        message: 'You must agree to the terms and conditions'
      });
      return;
    }

    setLoading(true);
    
    try {
      const result = await registerUser(data.name, data.email, data.password);
      
      if (result.success) {
        toast.success('Registration successful! Welcome to Learning Platform!');
        navigate(from, { replace: true });
      } else {
        toast.error(result.message || 'Registration failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <Container>
      <Helmet>
        <title>Register - Learning Platform</title>
        <meta name="description" content="Create an account to access courses, quizzes, and learning materials on Learning Platform" />
      </Helmet>

      <FormContainer>
        <Title>Create Account</Title>
        <Subtitle>Join Learning Platform to start your educational journey</Subtitle>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup>
            <Label htmlFor="name">Full Name</Label>
            <Input
              type="text"
              id="name"
              className={errors.name ? 'error' : ''}
              placeholder="Enter your full name"
              autoComplete="name"
              {...register('name', {
                required: 'Name is required',
                minLength: {
                  value: 2,
                  message: 'Name must be at least 2 characters'
                }
              })}
            />
            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </FormGroup>

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

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputContainer>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={errors.password ? 'error' : ''}
                placeholder="Create a password"
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
            <Label htmlFor="confirmPassword">Confirm Password</Label>
            <InputContainer>
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                className={errors.confirmPassword ? 'error' : ''}
                placeholder="Confirm your password"
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

          <CheckboxContainer>
            <Checkbox
              type="checkbox"
              id="agreeTerms"
              {...register('agreeTerms')}
            />
            <CheckboxLabel
              htmlFor="agreeTerms"
              className={errors.agreeTerms ? 'error' : ''}
            >
              I agree to the{' '}
              <Link to="/terms" target="_blank">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" target="_blank">Privacy Policy</Link>
            </CheckboxLabel>
          </CheckboxContainer>
          {errors.agreeTerms && <ErrorMessage>{errors.agreeTerms.message}</ErrorMessage>}

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </SubmitButton>
        </Form>

        <LoginPrompt>
          Already have an account?{' '}
          <Link to="/login" state={{ from: location.state?.from }}>
            Sign in to access your courses
          </Link>
        </LoginPrompt>
      </FormContainer>
    </Container>
  );
};

export default Register;