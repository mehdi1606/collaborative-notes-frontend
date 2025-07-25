import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { notesService } from '../../services/api';
import {
  HomeIcon,
  DocumentTextIcon,
  ShareIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  TagIcon,
  ChartBarIcon,
  FolderIcon,
  PlusIcon,
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';

// Sidebar container
const SidebarContainer = styled.aside`
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: ${props => props.collapsed ? '60px' : '250px'};
  background: ${props => props.theme.colors.sidebarBackground};
  border-right: 1px solid ${props => props.theme.colors.border};
  transition: all ${props => props.theme.transitions.normal};
  z-index: 100;
  overflow-y: auto;
  overflow-x: hidden;
  
  @media (max-width: 768px) {
    width: 250px;
    transform: translateX(${props => props.isOpen ? '0' : '-100%'});
    box-shadow: ${props => props.isOpen ? props.theme.shadows.lg : 'none'};
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1rem 0;
`;

// Collapse toggle
const CollapseToggle = styled.button`
  position: absolute;
  top: 1rem;
  right: -12px;
  width: 24px;
  height: 24px;
  background: ${props => props.theme.colors.surface};
  border: 1px solid ${props => props.theme.colors.border};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.textSecondary};
  transition: all ${props => props.theme.transitions.fast};
  z-index: 10;
  
  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  @media (max-width: 768px) {
    display: none;
  }
`;

// Mobile close button
const MobileCloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 32px;
  height: 32px;
  background: transparent;
  border: none;
  border-radius: ${props => props.theme.borderRadius.md};
  display: none;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.sidebarText};
  
  &:hover {
    background: ${props => props.theme.colors.sidebarHover};
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

// Navigation section
const NavSection = styled.div`
  margin-bottom: 2rem;
`;

const SectionTitle = styled.h3`
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.sidebarText};
  margin: 0 0 0.5rem 0;
  padding: 0 1rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: ${props => props.collapsed ? 0 : 0.7};
  transition: opacity ${props => props.theme.transitions.fast};
  
  ${props => props.collapsed && 'overflow: hidden; white-space: nowrap;'}
`;

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

const NavItem = styled.li`
  margin-bottom: 0.25rem;
`;

const NavLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: ${props => props.theme.colors.sidebarText};
  text-decoration: none;
  border-radius: 0 ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg} 0;
  margin-right: 0.5rem;
  transition: all ${props => props.theme.transitions.fast};
  position: relative;
  
  &:hover {
    background: ${props => props.theme.colors.sidebarHover};
    color: ${props => props.theme.colors.sidebarTextActive};
  }
  
  ${props => props.active && `
    background: ${props.theme.colors.sidebarHover};
    color: ${props.theme.colors.sidebarTextActive};
    
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background: ${props.theme.colors.primary};
    }
  `}
  
  svg {
    width: 20px;
    height: 20px;
    flex-shrink: 0;
  }
  
  ${props => props.collapsed && `
    justify-content: center;
    padding: 0.75rem;
    margin-right: 0;
    
    span {
      display: none;
    }
  `}
`;

// Badge for counters
const Badge = styled.span`
  background: ${props => props.theme.colors.primary};
  color: white;
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  padding: 0.25rem 0.5rem;
  border-radius: ${props => props.theme.borderRadius.full};
  margin-left: auto;
  min-width: 20px;
  text-align: center;
  
  ${props => props.collapsed && 'display: none;'}
`;

// Quick stats section
const StatsSection = styled.div`
  margin-top: auto;
  padding: 1rem;
  border-top: 1px solid ${props => props.theme.colors.border};
  
  ${props => props.collapsed && `
    padding: 1rem 0.5rem;
    text-align: center;
  `}
`;

const StatItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.sidebarText};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  ${props => props.collapsed && `
    flex-direction: column;
    gap: 0.25rem;
    
    span:first-child {
      font-size: 10px;
      opacity: 0.7;
    }
  `}
`;

const StatValue = styled.span`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  color: ${props => props.theme.colors.sidebarTextActive};
`;

// Tags section
const TagsSection = styled.div`
  margin-bottom: 1rem;
  max-height: 200px;
  overflow-y: auto;
`;

const TagItem = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  width: 100%;
  padding: 0.5rem 1rem;
  background: transparent;
  border: none;
  color: ${props => props.theme.colors.sidebarText};
  font-size: ${props => props.theme.typography.fontSize.sm};
  cursor: pointer;
  text-align: left;
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.sidebarHover};
    color: ${props => props.theme.colors.sidebarTextActive};
  }
  
  ${props => props.collapsed && `
    justify-content: center;
    
    span {
      display: none;
    }
  `}
`;

// Main Sidebar component
const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const { sidebarCollapsed, setSidebarCollapsed } = useTheme();
  const location = useLocation();
  
  const [stats, setStats] = useState({
    total: 0,
    private: 0,
    shared: 0,
    public: 0
  });
  
  const [commonTags, setCommonTags] = useState([]);

  // Load stats and tags
  useEffect(() => {
    const loadData = async () => {
      try {
        const [statsResponse, notesResponse] = await Promise.all([
          notesService.getNoteStats(),
          notesService.getNotes({ limit: 100 })
        ]);
        
        setStats(statsResponse.data.stats);
        
        // Extract and count tags
        const tagCounts = {};
        notesResponse.data.notes.forEach(note => {
          if (note.tags) {
            note.tags.split(',').forEach(tag => {
              const trimmedTag = tag.trim();
              if (trimmedTag) {
                tagCounts[trimmedTag] = (tagCounts[trimmedTag] || 0) + 1;
              }
            });
          }
        });
        
        // Get top 10 tags
        const sortedTags = Object.entries(tagCounts)
          .sort(([,a], [,b]) => b - a)
          .slice(0, 10)
          .map(([tag, count]) => ({ tag, count }));
        
        setCommonTags(sortedTags);
      } catch (error) {
        console.error('Failed to load sidebar data:', error);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  // Check if current path is active
  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  // Navigation items
  const navigationItems = [
    {
      icon: <HomeIcon />,
      label: 'Dashboard',
      path: '/dashboard',
      badge: null
    },
    {
      icon: <DocumentTextIcon />,
      label: 'My Notes',
      path: '/notes',
      badge: stats.total
    },
    {
      icon: <ShareIcon />,
      label: 'Shared Notes',
      path: '/shared',
      badge: null
    },
    {
      icon: <EyeIcon />,
      label: 'Public Notes',
      path: '/notes?status=public',
      badge: stats.public
    },
    {
      icon: <MagnifyingGlassIcon />,
      label: 'Search',
      path: '/search',
      badge: null
    }
  ];

  return (
    <>
      <SidebarContainer collapsed={sidebarCollapsed} isOpen={isOpen}>
        <CollapseToggle
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </CollapseToggle>

        <MobileCloseButton onClick={onClose}>
          <XMarkIcon />
        </MobileCloseButton>

        <SidebarContent>
          {/* Main Navigation */}
          <NavSection>
            <SectionTitle collapsed={sidebarCollapsed}>
              Navigation
            </SectionTitle>
            <NavList>
              {navigationItems.map((item) => (
                <NavItem key={item.path}>
                  <NavLink
                    to={item.path}
                    active={isActive(item.path)}
                    collapsed={sidebarCollapsed}
                    onClick={() => window.innerWidth <= 768 && onClose()}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                    {item.badge !== null && item.badge > 0 && (
                      <Badge collapsed={sidebarCollapsed}>{item.badge}</Badge>
                    )}
                  </NavLink>
                </NavItem>
              ))}
            </NavList>
          </NavSection>

          {/* Quick Actions */}
          <NavSection>
            <SectionTitle collapsed={sidebarCollapsed}>
              Quick Actions
            </SectionTitle>
            <NavList>
              <NavItem>
                <NavLink
                  to="/notes/new"
                  collapsed={sidebarCollapsed}
                  onClick={() => window.innerWidth <= 768 && onClose()}
                >
                  <PlusIcon />
                  <span>New Note</span>
                </NavLink>
              </NavItem>
            </NavList>
          </NavSection>

          {/* Common Tags */}
          {!sidebarCollapsed && commonTags.length > 0 && (
            <NavSection>
              <SectionTitle collapsed={sidebarCollapsed}>
                Popular Tags
              </SectionTitle>
              <TagsSection>
                {commonTags.map((tagData) => (
                  <TagItem
                    key={tagData.tag}
                    collapsed={sidebarCollapsed}
                    onClick={() => {
                      window.location.href = `/search?tags=${encodeURIComponent(tagData.tag)}`;
                      window.innerWidth <= 768 && onClose();
                    }}
                  >
                    <TagIcon style={{ width: 16, height: 16 }} />
                    <span>{tagData.tag} ({tagData.count})</span>
                  </TagItem>
                ))}
              </TagsSection>
            </NavSection>
          )}

          {/* Quick Stats */}
          <StatsSection collapsed={sidebarCollapsed}>
            <StatItem collapsed={sidebarCollapsed}>
              <span>Total Notes</span>
              <StatValue>{stats.total}</StatValue>
            </StatItem>
            <StatItem collapsed={sidebarCollapsed}>
              <span>Private</span>
              <StatValue>{stats.private}</StatValue>
            </StatItem>
            <StatItem collapsed={sidebarCollapsed}>
              <span>Shared</span>
              <StatValue>{stats.shared}</StatValue>
            </StatItem>
            <StatItem collapsed={sidebarCollapsed}>
              <span>Public</span>
              <StatValue>{stats.public}</StatValue>
            </StatItem>
          </StatsSection>
        </SidebarContent>
      </SidebarContainer>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 99,
            display: window.innerWidth <= 768 ? 'block' : 'none'
          }}
          onClick={onClose}
        />
      )}
    </>
  );
};

export default Sidebar;