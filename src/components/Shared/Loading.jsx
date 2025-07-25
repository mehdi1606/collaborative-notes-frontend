import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

const Loading = ({ text = 'Loading...' }) => {
  return (
    <LoadingContainer>
      <div style={{ textAlign: 'center' }}>
        <Spinner />
        <p style={{ marginTop: '1rem', color: '#6b7280' }}>{text}</p>
      </div>
    </LoadingContainer>
  );
};

export default Loading;
