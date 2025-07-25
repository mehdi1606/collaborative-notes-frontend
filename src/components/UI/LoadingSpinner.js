import React from 'react';
import styled, { keyframes } from 'styled-components';

// Spinner animations
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const pulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
`;

const bounce = keyframes`
  0%, 80%, 100% { transform: scale(0); }
  40% { transform: scale(1); }
`;

const wave = keyframes`
  0%, 60%, 100% { transform: initial; }
  30% { transform: translateY(-15px); }
`;

// Container for the spinner
const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${props => props.size === 'small' ? '1rem' : '2rem'};
  
  ${props => props.fullScreen && `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(2px);
    z-index: 9999;
  `}
  
  ${props => props.overlay && `
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.9);
    z-index: 100;
  `}
`;

// Default spinner (rotating circle)
const Spinner = styled.div`
  width: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '48px';
      default: return '32px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '48px';
      default: return '32px';
    }
  }};
  border: ${props => props.size === 'small' ? '2px' : '3px'} solid ${props => props.theme.colors.border};
  border-top: ${props => props.size === 'small' ? '2px' : '3px'} solid ${props => props.color || props.theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 1s linear infinite;
`;

// Dots spinner
const DotsContainer = styled.div`
  display: flex;
  gap: 4px;
`;

const Dot = styled.div`
  width: ${props => props.size === 'small' ? '6px' : '8px'};
  height: ${props => props.size === 'small' ? '6px' : '8px'};
  background: ${props => props.color || props.theme.colors.primary};
  border-radius: 50%;
  animation: ${bounce} 1.4s ease-in-out infinite both;
  animation-delay: ${props => props.delay}s;
`;

// Pulse spinner
const PulseSpinner = styled.div`
  width: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '48px';
      default: return '32px';
    }
  }};
  height: ${props => {
    switch (props.size) {
      case 'small': return '20px';
      case 'large': return '48px';
      default: return '32px';
    }
  }};
  background: ${props => props.color || props.theme.colors.primary};
  border-radius: 50%;
  animation: ${pulse} 1.5s ease-in-out infinite;
`;

// Wave spinner
const WaveContainer = styled.div`
  display: flex;
  gap: 2px;
`;

const WaveBar = styled.div`
  width: ${props => props.size === 'small' ? '3px' : '4px'};
  height: ${props => props.size === 'small' ? '20px' : '30px'};
  background: ${props => props.color || props.theme.colors.primary};
  border-radius: 2px;
  animation: ${wave} 1.2s ease-in-out infinite;
  animation-delay: ${props => props.delay}s;
`;

// Loading text
const LoadingText = styled.div`
  margin-top: 1rem;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  text-align: center;
  max-width: 200px;
`;

// Progress bar
const ProgressContainer = styled.div`
  width: 100%;
  max-width: 200px;
  margin-top: 1rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: ${props => props.theme.colors.border};
  border-radius: 2px;
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: ${props => props.color || props.theme.colors.primary};
  border-radius: 2px;
  width: ${props => props.progress || 0}%;
  transition: width 0.3s ease;
`;

// Main LoadingSpinner component
const LoadingSpinner = ({
  type = 'spinner',
  size = 'medium',
  color,
  text,
  fullScreen = false,
  overlay = false,
  progress,
  className,
  style
}) => {
  const renderSpinner = () => {
    switch (type) {
      case 'dots':
        return (
          <DotsContainer>
            <Dot size={size} color={color} delay={0} />
            <Dot size={size} color={color} delay={0.1} />
            <Dot size={size} color={color} delay={0.2} />
          </DotsContainer>
        );
      
      case 'pulse':
        return <PulseSpinner size={size} color={color} />;
      
      case 'wave':
        return (
          <WaveContainer>
            <WaveBar size={size} color={color} delay={0} />
            <WaveBar size={size} color={color} delay={0.1} />
            <WaveBar size={size} color={color} delay={0.2} />
            <WaveBar size={size} color={color} delay={0.3} />
            <WaveBar size={size} color={color} delay={0.4} />
          </WaveContainer>
        );
      
      default:
        return <Spinner size={size} color={color} />;
    }
  };

  return (
    <SpinnerContainer
      fullScreen={fullScreen}
      overlay={overlay}
      size={size}
      className={className}
      style={style}
    >
      {renderSpinner()}
      
      {text && <LoadingText>{text}</LoadingText>}
      
      {progress !== undefined && (
        <ProgressContainer>
          <ProgressBar>
            <ProgressFill progress={progress} color={color} />
          </ProgressBar>
        </ProgressContainer>
      )}
    </SpinnerContainer>
  );
};

// Specialized spinner components
export const ButtonSpinner = ({ size = 'small', color = 'currentColor' }) => (
  <Spinner size={size} color={color} style={{ margin: 0 }} />
);

export const InlineSpinner = ({ size = 'small', color, text }) => (
  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
    <Spinner size={size} color={color} style={{ margin: 0 }} />
    {text && <span style={{ fontSize: '0.875rem' }}>{text}</span>}
  </div>
);

export const PageSpinner = ({ text = 'Loading...' }) => (
  <LoadingSpinner
    type="spinner"
    size="large"
    text={text}
    fullScreen
  />
);

export const OverlaySpinner = ({ text }) => (
  <LoadingSpinner
    type="spinner"
    size="medium"
    text={text}
    overlay
  />
);

export default LoadingSpinner;