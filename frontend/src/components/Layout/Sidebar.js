import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FiHome, 
  FiBook, 
  FiAward, 
  FiUser, 
  FiBell, 
  FiSettings,
  FiBarChart2,
  FiBookmark,
  FiCalendar,
  FiHelpCircle
} from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const SidebarContainer = styled.aside`
  background-color: #fff;
  border-right: 1px solid #e9ecef;
  width: 250px;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  padding-top: 70px; /* Space for header */
  overflow-y: auto;
  transition: transform 0.3s ease;
  z-index: 90;
  
  @media (max-width: 992px) {
    transform: ${props => props.isOpen ? 'translateX(0)' : 'translateX(-100%)'};
    box-shadow: ${props => props.isOpen ? '0 0 15px rgba(0, 0, 0, 0.1)' : 'none'};
  }
`;

const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 80;
  display: none;
  
  @media (max-width: 992px) {
    display: ${props => props.isOpen ? 'block' : 'none'};
  }
`;

const SidebarContent = styled.div`
  padding: 1.5rem;
`;

const SidebarSection = styled.div`
  margin-bottom: 2rem;
`;

const SidebarSectionTitle = styled.h3`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  color: #6c757d;
  margin-bottom: 1rem;
  padding-left: 0.5rem;
`;

const SidebarNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const SidebarLink = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #495057;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.2s ease;
  
  &:hover {
    background-color: #f8f9fa;
    color: #000;
  }
  
  &.active {
    background-color: #f1f3f5;
    color: #000;
    font-weight: 500;
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const SidebarDivider = styled.div`
  height: 1px;
  background-color: #e9ecef;
  margin: 1.5rem 0;
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-top: 1px solid #e9ecef;
  margin-top: auto;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #e9ecef;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const UserName = styled.span`
  font-weight: 500;
  color: #212529;
`;

const UserRole = styled.span`
  font-size: 0.8rem;
  color: #6c757d;
`;

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  return (
    <>
      <SidebarOverlay isOpen={isOpen} onClick={onClose} />
      <SidebarContainer isOpen={isOpen}>
        <SidebarContent>
          <SidebarSection>
            <SidebarNav>
              <SidebarLink to="/home" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiHome />
                Dashboard
              </SidebarLink>
              <SidebarLink to="/programs" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiBook />
                Programs
              </SidebarLink>
              <SidebarLink to="/my-learning" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiAward />
                My Learning
              </SidebarLink>
              <SidebarLink to="/calendar" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiCalendar />
                Calendar
              </SidebarLink>
            </SidebarNav>
          </SidebarSection>
          
          <SidebarDivider />
          
          <SidebarSection>
            <SidebarSectionTitle>Personal</SidebarSectionTitle>
            <SidebarNav>
              <SidebarLink to="/profile" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiUser />
                Profile
              </SidebarLink>
              <SidebarLink to="/notifications" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiBell />
                Notifications
              </SidebarLink>
              <SidebarLink to="/bookmarks" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiBookmark />
                Bookmarks
              </SidebarLink>
              <SidebarLink to="/progress" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiBarChart2 />
                Progress
              </SidebarLink>
            </SidebarNav>
          </SidebarSection>
          
          <SidebarDivider />
          
          <SidebarSection>
            <SidebarSectionTitle>Support</SidebarSectionTitle>
            <SidebarNav>
              <SidebarLink to="/settings" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiSettings />
                Settings
              </SidebarLink>
              <SidebarLink to="/help" className={({ isActive }) => isActive ? 'active' : ''}>
                <FiHelpCircle />
                Help Center
              </SidebarLink>
            </SidebarNav>
          </SidebarSection>
        </SidebarContent>
        
        {user && (
          <UserSection>
            <UserAvatar>
              {user.avatar?.url ? (
                <img src={user.avatar.url} alt={user.name} />
              ) : (
                <FiUser />
              )}
            </UserAvatar>
            <UserInfo>
              <UserName>{user.name}</UserName>
              <UserRole>{user.role === 'admin' ? 'Administrator' : 'Student'}</UserRole>
            </UserInfo>
          </UserSection>
        )}
      </SidebarContainer>
    </>
  );
};

export default Sidebar;