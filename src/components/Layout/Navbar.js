import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';
import { SearchInput } from '../UI/Form';
import Button, { IconButton } from '../UI/Button';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  BellIcon,
  UserCircleIcon,
  SunIcon,
  MoonIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  ShareIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

// Navbar container
const NavbarContainer = styled.nav`
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  height: 60px;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  backdrop-filter: blur(8px);
`;

// Left section (logo + search)
const LeftSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  min-width: 0;
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: ${props => props.theme.colors.text};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  font-size: ${props => props.theme.typography.fontSize.lg};
  flex-shrink: 0;
  
  &:hover {
    color: ${props => props.theme.colors.primary};
  }
`;

const LogoIcon = styled.div`
  width: 32px;
  height: 32px;
  background: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
`;

const SearchContainer = styled.div`
  flex: 1;
  max-width: 400px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Center section (quick actions)
const CenterSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  @media (max-width: 1024px) {
    display: none;
  }
`;

const QuickAction = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  text-decoration: none;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

// Right section (actions + profile)
const RightSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
`;

const NotificationButton = styled(IconButton)`
  position: relative;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 18px;
  height: 18px;
  background: ${props => props.theme.colors.error};
  color: white;
  border-radius: 50%;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${props => props.theme.colors.surface};
`;

// Profile dropdown
const ProfileSection = styled.div`
  position: relative;
`;

const ProfileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  color: ${props => props.theme.colors.text};
  
  &:hover {
    background: ${props => props.theme.colors.hover};
  }
  
  @media (max-width: 640px) {
    padding: 0.25rem;
    
    span {
      display: none;
    }
  }
`;

const UserAvatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${props => props.theme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  min-width: 200px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  overflow: hidden;
  z-index: 1000;
  
  ${props => !props.isOpen && 'display: none;'}
`;

const DropdownItem = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background ${props => props.theme.transitions.fast};
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  &:hover {
    background: ${props => props.theme.colors.hover};
  }
  
  svg {
    width: 16px;
    height: 16px;
    color: ${props => props.theme.colors.textSecondary};
  }
`;

const DropdownDivider = styled.div`
  height: 1px;
  background: ${props => props.theme.colors.border};
  margin: 0.25rem 0;
`;

const UserInfo = styled.div`
  padding: 1rem;
  border-bottom: 1px solid ${props => props.theme.colors.border};
`;

const UserName = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
`;

const UserEmail = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textSecondary};
  margin-top: 0.25rem;
`;

// Mobile search overlay
const MobileSearchOverlay = styled.div`
  position: fixed;
  top: 60px;
  left: 0;
  right: 0;
  background: ${props => props.theme.colors.surface};
  border-bottom: 1px solid ${props => props.theme.colors.border};
  padding: 1rem;
  z-index: 999;
  
  ${props => !props.isOpen && 'display: none;'}
  
  @media (min-width: 769px) {
    display: none;
  }
`;

// Main Navbar component
const Navbar = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications] = useState(3); // Mock notification count
  
  const profileRef = useRef(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle search
  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setIsMobileSearchOpen(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Logged out successfully');
      navigate('/login');
    } catch (error) {
      showError('Failed to logout');
    }
    setIsProfileOpen(false);
  };

  // Get user initials
  const getUserInitials = (name) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';
  };

  return (
    <>
      <NavbarContainer>
        {/* Left Section */}
        <LeftSection>
          <Logo to="/dashboard">
            <LogoIcon>N</LogoIcon>
            <span>Notes</span>
          </Logo>
          
          <SearchContainer>
            <SearchInput
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onSearch={handleSearch}
              onClear={() => setSearchQuery('')}
            />
          </SearchContainer>
        </LeftSection>

        {/* Center Section - Quick Actions */}
        <CenterSection>
          <QuickAction to="/notes">
            <DocumentTextIcon />
            My Notes
          </QuickAction>
          <QuickAction to="/shared">
            <ShareIcon />
            Shared
          </QuickAction>
          <QuickAction to="/dashboard">
            <ChartBarIcon />
            Dashboard
          </QuickAction>
        </CenterSection>

        {/* Right Section */}
        <RightSection>
          {/* Mobile Search Toggle */}
          <IconButton
            variant="ghost"
            size="sm"
            icon={<MagnifyingGlassIcon />}
            onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}
            style={{ display: 'none' }}
            className="mobile-only"
          />

          {/* Create Note Button */}
          <Button
            variant="primary"
            size="sm"
            leftIcon={<PlusIcon />}
            onClick={() => navigate('/notes/new')}
          >
            <span className="hidden-mobile">New Note</span>
          </Button>

          {/* Theme Toggle */}
          <IconButton
            variant="ghost"
            size="sm"
            icon={isDark() ? <SunIcon /> : <MoonIcon />}
            onClick={toggleTheme}
            tooltip={`Switch to ${isDark() ? 'light' : 'dark'} mode`}
          />

          {/* Notifications */}
          <NotificationButton
            variant="ghost"
            size="sm"
            icon={<BellIcon />}
            onClick={() => showSuccess('No new notifications')}
          >
            {notifications > 0 && (
              <NotificationBadge>
                {notifications > 9 ? '9+' : notifications}
              </NotificationBadge>
            )}
          </NotificationButton>

          {/* Profile Dropdown */}
          <ProfileSection ref={profileRef}>
            <ProfileButton onClick={() => setIsProfileOpen(!isProfileOpen)}>
              <UserAvatar>
                {user ? getUserInitials(user.name) : <UserCircleIcon />}
              </UserAvatar>
              <span>{user?.name}</span>
              <ChevronDownIcon style={{ width: 16, height: 16 }} />
            </ProfileButton>

            <DropdownMenu isOpen={isProfileOpen}>
              <UserInfo>
                <UserName>{user?.name}</UserName>
                <UserEmail>{user?.email}</UserEmail>
              </UserInfo>

              <DropdownItem onClick={() => {
                navigate('/profile');
                setIsProfileOpen(false);
              }}>
                <UserCircleIcon />
                Profile
              </DropdownItem>

              <DropdownItem onClick={() => {
                navigate('/settings');
                setIsProfileOpen(false);
              }}>
                <Cog6ToothIcon />
                Settings
              </DropdownItem>

              <DropdownDivider />

              <DropdownItem onClick={handleLogout}>
                <ArrowRightOnRectangleIcon />
                Sign Out
              </DropdownItem>
            </DropdownMenu>
          </ProfileSection>
        </RightSection>
      </NavbarContainer>

      {/* Mobile Search Overlay */}
      <MobileSearchOverlay isOpen={isMobileSearchOpen}>
        <SearchInput
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onSearch={handleSearch}
          onClear={() => setSearchQuery('')}
          autoFocus
        />
      </MobileSearchOverlay>

      <style jsx>{`
        @media (max-width: 640px) {
          .hidden-mobile {
            display: none;
          }
          .mobile-only {
            display: flex !important;
          }
        }
        @media (min-width: 641px) {
          .mobile-only {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};

export default Navbar;