import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FiGithub, FiTwitter, FiLinkedin, FiMail, FiHeart } from 'react-icons/fi';

const FooterContainer = styled.footer`
  background-color: #f8f9fa;
  padding: 3rem 2rem;
  margin-top: auto;
      position: sticky;
    top: 0;
    z-index: 100;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
`;

const FooterTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: #333;
`;

const FooterLink = styled(Link)`
  color: #666;
  text-decoration: none;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  
  &:hover {
    color: #000;
    text-decoration: underline;
  }
`;

const FooterText = styled.p`
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
  line-height: 1.5;
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialLink = styled.a`
  color: #666;
  font-size: 1.2rem;
  
  &:hover {
    color: #000;
  }
`;

const BottomBar = styled.div`
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 1.5rem;
  border-top: 1px solid #dee2e6;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
`;

const Copyright = styled.p`
  color: #666;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const FooterNav = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const FooterNavLink = styled(Link)`
  color: #666;
  text-decoration: none;
  font-size: 0.9rem;
  
  &:hover {
    color: #000;
    text-decoration: underline;
  }
`;

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterTitle>Learning Platform</FooterTitle>
          <FooterText>
            Empowering learners worldwide with high-quality educational content and interactive learning experiences.
          </FooterText>
          <SocialLinks>
            <SocialLink href="https://github.com" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FiGithub />
            </SocialLink>
            <SocialLink href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FiTwitter />
            </SocialLink>
            <SocialLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FiLinkedin />
            </SocialLink>
            <SocialLink href="mailto:info@learningplatform.com" aria-label="Email">
              <FiMail />
            </SocialLink>
          </SocialLinks>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Programs</FooterTitle>
          <FooterLink to="/programs?category=training">Training Programs</FooterLink>
          <FooterLink to="/programs?category=workshop">Workshops</FooterLink>
          <FooterLink to="/programs?category=course">Courses</FooterLink>
          <FooterLink to="/programs?category=certification">Certifications</FooterLink>
          <FooterLink to="/programs">All Programs</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Resources</FooterTitle>
          <FooterLink to="/resources">Learning Resources</FooterLink>
          <FooterLink to="/blog">Blog</FooterLink>
          <FooterLink to="/faq">FAQ</FooterLink>
          <FooterLink to="/support">Support</FooterLink>
          <FooterLink to="/contact">Contact Us</FooterLink>
        </FooterSection>
        
        <FooterSection>
          <FooterTitle>Account</FooterTitle>
          <FooterLink to="/login">Login</FooterLink>
          <FooterLink to="/register">Register</FooterLink>
          <FooterLink to="/profile">My Profile</FooterLink>
          <FooterLink to="/my-learning">My Learning</FooterLink>
          <FooterLink to="/settings">Settings</FooterLink>
        </FooterSection>
      </FooterContent>
      
      <BottomBar>
        <Copyright>
          &copy; {currentYear} Learning Platform. All rights reserved. Made with <FiHeart style={{ color: '#dc3545' }} />
        </Copyright>
        
        <FooterNav>
          <FooterNavLink to="/terms">Terms of Service</FooterNavLink>
          <FooterNavLink to="/privacy">Privacy Policy</FooterNavLink>
          <FooterNavLink to="/cookies">Cookie Policy</FooterNavLink>
        </FooterNav>
      </BottomBar>
    </FooterContainer>
  );
};

export default Footer;