import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FiMenu, FiX, FiUser, FiBell, FiLogOut, FiHome, FiBook, FiAward, FiSettings } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

const HeaderContainer = styled.header`
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
`;

const HeaderContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  text-decoration: none;
  display: flex;
  align-items: center;
  
  &:hover {
    color: #000;
  }
`;

const LogoImage = styled.img`
  height: 40px;
  margin-right: 0.5rem;
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileNav = styled.nav`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #fff;
  z-index: 200;
  padding: 2rem;
  flex-direction: column;
  
  @media (max-width: 768px) {
    display: ${props => props.isOpen ? 'flex' : 'none'};
  }
`;

const MobileNavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const MobileNavLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const NavLink = styled(Link)`
  color: #333;
  text-decoration: none;
  font-weight: 500;
  margin-left: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #000;
  }
  
  &.active {
    color: #000;
    font-weight: 600;
  }
  
  @media (max-width: 768px) {
    margin-left: 0;
    font-size: 1.2rem;
  }
`;

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const UserMenu = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const UserMenuButton = styled.button`
  background: none;
  border: none;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  margin-left: 1rem;
  position: relative;
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: #dc3545;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 600;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserMenuDropdown = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #fff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 6px;
  padding: 1rem 0;
  min-width: 200px;
  display: ${props => props.isOpen ? 'block' : 'none'};
  margin-top: 0.5rem;
`;

const UserMenuLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  
  &:hover {
    background-color: #f8f9fa;
    color: #000;
  }
`;

const UserMenuButton2 = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  color: #333;
  text-decoration: none;
  font-weight: 500;
  background: none;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  
  &:hover {
    background-color: #f8f9fa;
    color: #000;
  }
`;

const UserMenuDivider = styled.div`
  height: 1px;
  background-color: #e9ecef;
  margin: 0.5rem 0;
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 0.5rem;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const AvatarPlaceholder = styled(FiUser)`
  width: 18px;
  height: 18px;
  color: #adb5bd;
`;

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuOpen && !event.target.closest('.user-menu')) {
        setUserMenuOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [userMenuOpen]);
  
  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);
  
  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  return (
    <HeaderContainer>
      <HeaderContent>
        <Logo to={user ? '/home' : '/'}>
          {/* <LogoImage src="/logo.png" alt="Learning Platform" /> */}
          Learning Platform
        </Logo>
        
        {user ? (
          <>
            <Nav>
              <NavLink to="/home" className={isActive('/home') ? 'active' : ''}>
                <FiHome size={18} />
                Home
              </NavLink>
             
              <NavLink to="/my-learning" className={isActive('/my-learning') ? 'active' : ''}>
                <FiAward size={18} />
                My Learning
              </NavLink>
            </Nav>
            
            <UserMenu className="user-menu">
              <UserMenuButton 
                onClick={() => navigate('/notifications')}
                aria-label="Notifications"
              >
                <FiBell size={22} />
                {unreadCount > 0 && <NotificationBadge>{unreadCount}</NotificationBadge>}
              </UserMenuButton>
              
              <UserMenuButton 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                aria-label="User menu"
                className="user-menu"
              >
                <Avatar>
                  {user?.avatar?.url ? (
                    <img src={user.avatar.url} alt={user.name} />
                  ) : (
                    <AvatarPlaceholder />
                  )}
                </Avatar>
              </UserMenuButton>
              
              <UserMenuDropdown isOpen={userMenuOpen}>
                <UserMenuLink to="/profile">
                  <FiUser size={18} />
                  My Profile
                </UserMenuLink>
                <UserMenuLink to="/settings">
                  <FiSettings size={18} />
                  Settings
                </UserMenuLink>
                <UserMenuDivider />
                <UserMenuButton2 onClick={handleLogout}>
                  <FiLogOut size={18} />
                  Logout
                </UserMenuButton2>
              </UserMenuDropdown>
            </UserMenu>
            
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
              <FiMenu size={24} />
            </MobileMenuButton>
          </>
        ) : (
          <>
            <Nav>
              <NavLink to="/login" className={isActive('/login') ? 'active' : ''}>
                Login
              </NavLink>
              <NavLink to="/register" className={isActive('/register') ? 'active' : ''}>
                Register
              </NavLink>
            </Nav>
            
            <MobileMenuButton onClick={() => setMobileMenuOpen(true)}>
              <FiMenu size={24} />
            </MobileMenuButton>
          </>
        )}
      </HeaderContent>
      
      <MobileNav isOpen={mobileMenuOpen}>
        <MobileNavHeader>
          <Logo to={user ? '/home' : '/'}>
            Learning Platform
          </Logo>
          <MobileMenuButton onClick={() => setMobileMenuOpen(false)}>
            <FiX size={24} />
          </MobileMenuButton>
        </MobileNavHeader>
        
        <MobileNavLinks>
          {user ? (
            <>
              <NavLink to="/home" className={isActive('/home') ? 'active' : ''}>
                <FiHome size={18} />
                Home
              </NavLink>
              
              <NavLink to="/my-learning" className={isActive('/my-learning') ? 'active' : ''}>
                <FiAward size={18} />
                My Learning
              </NavLink>
              <NavLink to="/notifications" className={isActive('/notifications') ? 'active' : ''}>
                <FiBell size={18} />
                Notifications
                {unreadCount > 0 && ` (${unreadCount})`}
              </NavLink>
              <NavLink to="/profile" className={isActive('/profile') ? 'active' : ''}>
                <FiUser size={18} />
                My Profile
              </NavLink>
              <NavLink to="/settings" className={isActive('/settings') ? 'active' : ''}>
                <FiSettings size={18} />
                Settings
              </NavLink>
              <UserMenuButton2 onClick={handleLogout}>
                <FiLogOut size={18} />
                Logout
              </UserMenuButton2>
            </>
          ) : (
            <>
              <NavLink to="/login" className={isActive('/login') ? 'active' : ''}>
                Login
              </NavLink>
              <NavLink to="/register" className={isActive('/register') ? 'active' : ''}>
                Register
              </NavLink>
            </>
          )}
        </MobileNavLinks>
      </MobileNav>
    </HeaderContainer>
  );
};

export default Header;