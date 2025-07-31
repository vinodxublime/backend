import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Header from './Header';
import Footer from './Footer';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  margin-top: 70px; /* Space for fixed header */
`;

const SidebarWrapper = styled.div`
  width: 250px;
  flex-shrink: 0;
  
  @media (max-width: 992px) {
    display: none;
  }
`;

const ContentWrapper = styled.div`
  flex: 1;
  padding: 2rem;
  margin-left: ${props => props.hasSidebar ? '250px' : '0'};
  
  @media (max-width: 992px) {
    margin-left: 0;
    padding: 1.5rem;
  }
`;

const MainLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();
  const location = useLocation();
  
  // Determine if the current route should have a sidebar
  const shouldShowSidebar = () => {
    // Public routes that don't need a sidebar
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
    
    // Check if the current path is a public route
    if (publicRoutes.includes(location.pathname)) {
      return false;
    }
    
    // Show sidebar for authenticated users on dashboard routes
    return !!user;
  };
  
  const hasSidebar = shouldShowSidebar();
  
  // Close sidebar when route changes (for mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);
  
  // Toggle sidebar for mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <LayoutContainer>
      <Header onMenuClick={toggleSidebar} />
      
      <MainContent>
        {hasSidebar && (
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        )}
        
        <ContentWrapper hasSidebar={hasSidebar}>
          {children}
        </ContentWrapper>
      </MainContent>
      
      <Footer />
    </LayoutContainer>
  );
};

export default MainLayout;