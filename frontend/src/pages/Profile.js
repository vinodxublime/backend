import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 20px;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  color: #333;
`;

const ProfileContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const ProfileSection = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
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

const InputContainer = styled.div`
  position: relative;
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
  padding: 12px 16px;
  background: #000;
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

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

const ProfileInfo = styled.div`
  margin-bottom: 1.5rem;
`;

const InfoLabel = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 0.25rem;
`;

const InfoValue = styled.div`
  font-size: 1.1rem;
  color: #333;
`;

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarPlaceholder = styled(FiUser)`
  width: 50px;
  height: 50px;
  color: #adb5bd;
`;

const FileInput = styled.input`
  display: none;
`;

const FileInputLabel = styled.label`
  padding: 8px 16px;
  background: #f8f9fa;
  color: #333;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #e9ecef;
  }
`;

const Profile = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  
  const { user, updateProfile, changePassword, uploadAvatar } = useAuth();
  
  const { 
    register: registerProfile, 
    handleSubmit: handleSubmitProfile, 
    formState: { errors: errorsProfile },
    reset: resetProfile
  } = useForm({
    defaultValues: {
      name: '',
      email: ''
    },
    mode: 'onBlur'
  });
  
  const { 
    register: registerPassword, 
    handleSubmit: handleSubmitPassword, 
    formState: { errors: errorsPassword },
    reset: resetPassword,
    watch
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    },
    mode: 'onBlur'
  });
  
  const newPassword = watch('newPassword', '');
  
  useEffect(() => {
    if (user) {
      resetProfile({
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user, resetProfile]);
  
  const onSubmitProfile = async (data) => {
    console.log('Profile data:', data);

   // setLoadingProfile(true);
    
    try {
      const result = await updateProfile(data);
 
    console.log('Profile data1:', result.success);
     alert("Loginccccccccccc successful!");  
      if (result.success) {
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoadingProfile(false);
    }
  };
  
  const onSubmitPassword = async (data) => {
    setLoadingPassword(true);
    
    try {
      const result = await changePassword(data.currentPassword, data.newPassword);
      
      if (result.success) {
        toast.success('Password changed successfully');
        resetPassword({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        toast.error(result.message || 'Failed to change password');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoadingPassword(false);
    }
  };
  
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    // Preview the selected image
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
    
    // Upload the avatar
    setLoadingAvatar(true);
    
    try {
      const result = await uploadAvatar(file);
      
      if (result.success) {
        toast.success('Avatar uploaded successfully');
      } else {
        toast.error(result.message || 'Failed to upload avatar');
        setAvatarPreview(null);
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
      setAvatarPreview(null);
    } finally {
      setLoadingAvatar(false);
    }
  };
  
  return (
    <Container>
      <Helmet>
        <title>My Profile - Learning Platform</title>
        <meta name="description" content="Manage your profile and account settings" />
      </Helmet>
      
      <PageTitle>My Profile</PageTitle>
      
      <ProfileContainer>
        <ProfileSection>
          <SectionTitle>
            <FiUser size={20} />
            Personal Information
          </SectionTitle>
          
          <AvatarContainer>
            <Avatar>
              {avatarPreview || (user?.avatar?.url) ? (
                <img src={avatarPreview || user?.avatar?.url} alt={user?.name} />
              ) : (
                <AvatarPlaceholder />
              )}
            </Avatar>
            <FileInputLabel htmlFor="avatar">
              {loadingAvatar ? 'Uploading...' : 'Change Avatar'}
            </FileInputLabel>
            <FileInput
              type="file"
              id="avatar"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={loadingAvatar}
            />
          </AvatarContainer>
          
          <Form onSubmit={handleSubmitProfile(onSubmitProfile)}>
            <FormGroup>
              <Label htmlFor="name">Full Name</Label>
              <Input
                type="text"
                id="name"
                className={errorsProfile.name ? 'error' : ''}
                placeholder="Enter your full name"
                {...registerProfile('name', { 
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters'
                  }
                })}
              />
              {errorsProfile.name && <ErrorMessage>{errorsProfile.name.message}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="email">Email Address</Label>
              <Input
                type="email"
                id="email"
                className={errorsProfile.email ? 'error' : ''}
                placeholder="Enter your email"
                {...registerProfile('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: 'Email is invalid'
                  }
                })}
              />
              {errorsProfile.email && <ErrorMessage>{errorsProfile.email.message}</ErrorMessage>}
            </FormGroup>
            
            <SubmitButton type="submit" disabled={loadingProfile}>
              {loadingProfile ? 'Updating...' : 'Update Profile'}
            </SubmitButton>
          </Form>
        </ProfileSection>
        
        <ProfileSection>
          <SectionTitle>
            <FiLock size={20} />
            Change Password
          </SectionTitle>
          
          <Form onSubmit={handleSubmitPassword(onSubmitPassword)}>
            <FormGroup>
              <Label htmlFor="currentPassword">Current Password</Label>
              <InputContainer>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="currentPassword"
                  className={errorsPassword.currentPassword ? 'error' : ''}
                  placeholder="Enter your current password"
                  {...registerPassword('currentPassword', { 
                    required: 'Current password is required'
                  })}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </PasswordToggle>
              </InputContainer>
              {errorsPassword.currentPassword && <ErrorMessage>{errorsPassword.currentPassword.message}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="newPassword">New Password</Label>
              <InputContainer>
                <Input
                  type={showNewPassword ? 'text' : 'password'}
                  id="newPassword"
                  className={errorsPassword.newPassword ? 'error' : ''}
                  placeholder="Enter your new password"
                  {...registerPassword('newPassword', { 
                    required: 'New password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </PasswordToggle>
              </InputContainer>
              {errorsPassword.newPassword && <ErrorMessage>{errorsPassword.newPassword.message}</ErrorMessage>}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <InputContainer>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  className={errorsPassword.confirmPassword ? 'error' : ''}
                  placeholder="Confirm your new password"
                  {...registerPassword('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: value => value === newPassword || 'Passwords do not match'
                  })}
                />
                <PasswordToggle
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                </PasswordToggle>
              </InputContainer>
              {errorsPassword.confirmPassword && <ErrorMessage>{errorsPassword.confirmPassword.message}</ErrorMessage>}
            </FormGroup>
            
            <SubmitButton type="submit" disabled={loadingPassword}>
              {loadingPassword ? 'Changing Password...' : 'Change Password'}
            </SubmitButton>
          </Form>
        </ProfileSection>
      </ProfileContainer>
    </Container>
  );
};

export default Profile;