import React, { useState,useContext  } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { FaGoogle, FaFacebook } from 'react-icons/fa';
import  { useAuth  } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { auth, googleProvider, facebookProvider } from '../firebase';

//import { getAuth,GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

 import {getAuth,FacebookAuthProvider, signInWithPopup,fetchSignInMethodsForEmail, GoogleAuthProvider,signInWithCredential} from 'firebase/auth';

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

const ForgotPassword = styled(Link)`
  text-align: center;
  color: #666;
  text-decoration: none;
  font-size: 14px;
  margin: 1rem 0;

  &:hover {
    color: #000;
    text-decoration: underline;
  }
`;

const SignupPrompt = styled.div`
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

const SocialButton = styled.button`
  width: 100%;
  padding: 12px;
  margin-bottom: 1rem;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  cursor: pointer;
  background: #f5f5f5;
  color: #333;
  transition: background 0.2s;

  &:hover {
    background: #e9ecef;
  }
`;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuth();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/home';

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onBlur'
  });

  const onSubmit = async (data) => {
    setLoading(true);
    
    try {
      const result = await login(data.email, data.password);
      
      if (result.success) {
        toast.success('Login successful!');
        navigate('/profile', { replace: true });
      } else {
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const token = await result.user.getIdToken();

    console.log("✅ Firebase ID Token:", token);

    // Send token to your backend
    const response = await fetch('http://localhost:5000/api/firebase/firebase-login', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  credentials: 'include', // optional, only if cookies are used
})

    const data = await response.json();

    if (response.ok && data.success) {
      // Save token or any custom data if needed
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user)); // optional
      console.log('User from backend:', data.user);
      setUser(data.user);
      navigate('/home', { replace: true });
    } else {
      console.error('❌ Backend login failed:', data.message || 'Unknown error');
    }
  } catch (error) {
    console.error('❌ Google login failed:', error);
  }
};

const handleFacebookLogin = async () => {
  try {
    const result = await signInWithPopup(auth, facebookProvider);
    const token = await result.user.getIdToken();

    // ✅ Same backend POST as Google
    const response = await fetch('http://localhost:5000/api/firebase/firebase-login', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user);
      navigate('/home', { replace: true });
    } else {
      console.error('❌ Backend login failed:', data.message || 'Unknown error');
    }
  } catch (error) {
    if (error.code === 'auth/account-exists-with-different-credential') {
      const pendingCred = FacebookAuthProvider.credentialFromError(error);
      const email = error.customData?.email;

      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.includes('google.com')) {
        const googleProvider = new GoogleAuthProvider();

        try {
          const googleResult = await signInWithPopup(auth, googleProvider);
          // ✅ Link Facebook credential to existing Google account
          await googleResult.user.linkWithCredential(pendingCred);

          const linkedToken = await googleResult.user.getIdToken();

          const response = await fetch('http://localhost:5000/api/firebase/firebase-login', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${linkedToken}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (response.ok && data.success) {
            localStorage.setItem('token', linkedToken);
            localStorage.setItem('user', JSON.stringify(data.user));
            setUser(data.user);
            navigate('/home', { replace: true });
          } else {
            console.error('❌ Backend login failed after linking:', data.message || 'Unknown error');
          }
        } catch (linkError) {
          console.error('❌ Failed to link accounts:', linkError);
        }
      } else {
        console.warn(`No supported method to auto-link. Existing method(s): ${methods.join(', ')}`);
        toast.error('Please login using your original provider.');
      }
    } else {
      console.error('❌ Facebook login failed:', error);
      toast.error(error.message || 'Facebook login failed');
    }
  }
};




  return (
    <Container>
      <Helmet>
        <title>Login - Learning Platform</title>
        <meta name="description" content="Login to your Learning Platform account to access your courses, quizzes, and learning progress" />
      </Helmet>

      <FormContainer>
        <Title>Welcome to Learning Platform</Title>
        <Subtitle>Login to access your courses and learning materials</Subtitle>

      

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

          <FormGroup>
            <Label htmlFor="password">Password</Label>
            <InputContainer>
              <Input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className={errors.password ? 'error' : ''}
                placeholder="Enter your password"
                autoComplete="current-password"
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
            {errors.password && <ErrorMessage>{errors.password.message}</ErrorMessage>}
          </FormGroup>

          <SubmitButton type="submit" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </SubmitButton>
        </Form>

        <ForgotPassword to="/forgot-password">
          Forgot your password?
        </ForgotPassword>
        <SocialButton type="button" onClick={handleGoogleLogin}>
          <FaGoogle /> Continue with Google
        </SocialButton>
        <SocialButton type="button" onClick={handleFacebookLogin}>
          <FaFacebook /> Continue with Facebook
        </SocialButton> 
        <SignupPrompt>
          Don't have an account?{' '}
          <Link to="/register" state={{ from: location.state?.from }}>
            Sign up here
          </Link>
        </SignupPrompt>
      </FormContainer>
    </Container>
  );
};

export default Login;