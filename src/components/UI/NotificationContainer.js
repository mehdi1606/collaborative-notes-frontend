import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNotification } from '../../contexts/NotificationContext';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

// Animations
const slideInRight = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutRight = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(100%);
    opacity: 0;
  }
`;

const slideInLeft = keyframes`
  from {
    transform: translateX(-100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const slideOutLeft = keyframes`
  from {
    transform: translateX(0);
    opacity: 1;
  }
  to {
    transform: translateX(-100%);
    opacity: 0;
  }
`;

const slideInTop = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutTop = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(-100%);
    opacity: 0;
  }
`;

const slideInBottom = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const slideOutBottom = keyframes`
  from {
    transform: translateY(0);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
`;

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

// Container for all notifications
const NotificationContainer = styled.div`
  position: fixed;
  z-index: 10000;
  pointer-events: none;
  
  ${props => {
    const { position } = props;
    
    switch (position) {
      case 'top-right':
        return `
          top: 1rem;
          right: 1rem;
        `;
      case 'top-left':
        return `
          top: 1rem;
          left: 1rem;
        `;
      case 'top-center':
        return `
          top: 1rem;
          left: 50%;
          transform: translateX(-50%);
        `;
      case 'bottom-right':
        return `
          bottom: 1rem;
          right: 1rem;
        `;
      case 'bottom-left':
        return `
          bottom: 1rem;
          left: 1rem;
        `;
      case 'bottom-center':
        return `
          bottom: 1rem;
          left: 50%;
          transform: translateX(-50%);
        `;
      default:
        return `
          top: 1rem;
          right: 1rem;
        `;
    }
  }}

  @media (max-width: 640px) {
    left: 1rem;
    right: 1rem;
    transform: none;
  }
`;

// Individual notification
const NotificationWrapper = styled.div`
  margin-bottom: 0.75rem;
  pointer-events: auto;
  
  ${props => {
    const { position, isExiting } = props;
    const isTop = position.includes('top');
    const isLeft = position.includes('left');
    const isRight = position.includes('right');
    const isCenter = position.includes('center');
    
    if (isExiting) {
      if (isTop) return `animation: ${slideOutTop} 0.3s ease-in-out forwards;`;
      if (isLeft) return `animation: ${slideOutLeft} 0.3s ease-in-out forwards;`;
      if (isRight) return `animation: ${slideOutRight} 0.3s ease-in-out forwards;`;
      return `animation: ${slideOutBottom} 0.3s ease-in-out forwards;`;
    }
    
    if (isTop) return `animation: ${slideInTop} 0.3s ease-out;`;
    if (isLeft) return `animation: ${slideInLeft} 0.3s ease-out;`;
    if (isRight) return `animation: ${slideInRight} 0.3s ease-out;`;
    return `animation: ${slideInBottom} 0.3s ease-out;`;
  }}
`;

const Notification = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  min-width: 320px;
  max-width: 480px;
  padding: 1rem;
  border-radius: ${props => props.theme.borderRadius.lg};
  box-shadow: ${props => props.theme.shadows.lg};
  backdrop-filter: blur(8px);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${props => props.theme.shadows.xl};
  }

  ${props => {
    const { type, theme } = props;
    
    switch (type) {
      case 'success':
        return `
          background: ${theme.colors.success}10;
          border-color: ${theme.colors.success}30;
          color: ${theme.colors.success};
        `;
      case 'error':
        return `
          background: ${theme.colors.error}10;
          border-color: ${theme.colors.error}30;
          color: ${theme.colors.error};
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning}10;
          border-color: ${theme.colors.warning}30;
          color: ${theme.colors.warning};
        `;
      case 'info':
      default:
        return `
          background: ${theme.colors.info}10;
          border-color: ${theme.colors.info}30;
          color: ${theme.colors.info};
        `;
    }
  }}

  @media (max-width: 640px) {
    min-width: auto;
    max-width: none;
    margin: 0;
  }
`;

const IconWrapper = styled.div`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  
  ${props => props.isPulsing && `
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`;

const ContentWrapper = styled.div`
  flex: 1;
  min-width: 0;
`;

const Title = styled.div`
  font-weight: ${props => props.theme.typography.fontWeight.semibold};
  font-size: ${props => props.theme.typography.fontSize.sm};
  margin-bottom: 0.25rem;
  color: ${props => props.theme.colors.text};
`;

const Message = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  color: ${props => props.theme.colors.textSecondary};
  line-height: 1.4;
  word-wrap: break-word;
`;

const ActionsWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.75rem;
  font-size: ${props => props.theme.typography.fontSize.xs};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid currentColor;
  background: transparent;
  color: currentColor;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: currentColor;
    color: white;
  }
`;

const CloseButton = styled.button`
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  color: ${props => props.theme.colors.textMuted};
  cursor: pointer;
  border-radius: ${props => props.theme.borderRadius.sm};
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: ${props => props.theme.colors.hover};
    color: ${props => props.theme.colors.text};
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: currentColor;
  opacity: 0.3;
  border-radius: 0 0 ${props => props.theme.borderRadius.lg} ${props => props.theme.borderRadius.lg};
  transform-origin: left;
  transition: transform linear;
  transform: scaleX(${props => props.progress});
`;

// Get icon for notification type
const getIcon = (type, icon) => {
  if (icon === 'loading') {
    return <div style={{ width: 24, height: 24 }}>⟳</div>; // Simple loading icon
  }

  switch (type) {
    case 'success':
      return <CheckCircleIcon />;
    case 'error':
      return <XCircleIcon />;
    case 'warning':
      return <ExclamationTriangleIcon />;
    case 'info':
    default:
      return <InformationCircleIcon />;
  }
};

// Individual notification component
const NotificationItem = ({ notification, onRemove, position }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [progress, setProgress] = useState(1);

  const {
    id,
    type,
    title,
    message,
    duration,
    actions,
    persistent,
    icon,
    onClick,
    createdAt
  } = notification;

  // Handle auto-dismiss progress
  useEffect(() => {
    if (persistent || !duration) return;

    const startTime = Date.now();
    const endTime = createdAt + duration;
    
    const updateProgress = () => {
      const now = Date.now();
      const elapsed = now - createdAt;
      const remaining = Math.max(0, 1 - (elapsed / duration));
      
      setProgress(remaining);
      
      if (remaining > 0) {
        requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
  }, [createdAt, duration, persistent]);

  const handleRemove = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(id), 300);
  };

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <NotificationWrapper position={position} isExiting={isExiting}>
      <Notification 
        type={type} 
        onClick={handleClick}
        style={{ position: 'relative' }}
      >
        <IconWrapper isPulsing={icon === 'loading'}>
          {getIcon(type, icon)}
        </IconWrapper>
        
        <ContentWrapper>
          {title && <Title>{title}</Title>}
          {message && <Message>{message}</Message>}
          
          {actions && actions.length > 0 && (
            <ActionsWrapper>
              {actions.map((action, index) => (
                <ActionButton
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                    if (action.dismiss !== false) {
                      handleRemove();
                    }
                  }}
                >
                  {action.label}
                </ActionButton>
              ))}
            </ActionsWrapper>
          )}
        </ContentWrapper>
        
        <CloseButton onClick={(e) => {
          e.stopPropagation();
          handleRemove();
        }}>
          <XMarkIcon style={{ width: 16, height: 16 }} />
        </CloseButton>
        
        {!persistent && duration && (
          <ProgressBar progress={progress} />
        )}
      </Notification>
    </NotificationWrapper>
  );
};

// Main container component
const NotificationContainerComponent = () => {
  const { notifications, position, removeNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <NotificationContainer position={position}>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={removeNotification}
          position={position}
        />
      ))}
    </NotificationContainer>
  );
};

export default NotificationContainerComponent;