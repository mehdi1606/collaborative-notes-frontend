import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNotification } from '../../contexts/NotificationContext';

const NotificationContainer = styled.div`
  position: fixed;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const NotificationItem = styled.div`
  background: ${props => {
    switch (props.type) {
      case 'success': return '#10b981';
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      default: return '#3b82f6';
    }
  }};
  color: white;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  cursor: pointer;
  transform: translateX(0);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(-5px);
  }
`;

const Notification = () => {
  const { notifications, removeNotification } = useNotification();

  return (
    <NotificationContainer>
      {notifications.map(notification => (
        <NotificationItem
          key={notification.id}
          type={notification.type}
          onClick={() => removeNotification(notification.id)}
        >
          {notification.message}
        </NotificationItem>
      ))}
    </NotificationContainer>
  );
};

export default Notification;
