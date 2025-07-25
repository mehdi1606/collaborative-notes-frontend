import React from 'react';
import styled, { css } from 'styled-components';
import { ButtonSpinner } from './LoadingSpinner';

// Button base styles
const BaseButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-family: ${props => props.theme.typography.fontFamily.sans};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid transparent;
  cursor: pointer;
  transition: all ${props => props.theme.transitions.fast};
  text-decoration: none;
  position: relative;
  overflow: hidden;
  
  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${props => props.theme.colors.focus};
  }
  
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  /* Size variants */
  ${props => {
    switch (props.size) {
      case 'xs':
        return css`
          padding: 0.25rem 0.5rem;
          font-size: ${props.theme.typography.fontSize.xs};
          min-height: 24px;
        `;
      case 'sm':
        return css`
          padding: 0.375rem 0.75rem;
          font-size: ${props.theme.typography.fontSize.sm};
          min-height: 32px;
        `;
      case 'lg':
        return css`
          padding: 0.75rem 1.5rem;
          font-size: ${props.theme.typography.fontSize.lg};
          min-height: 48px;
        `;
      case 'xl':
        return css`
          padding: 1rem 2rem;
          font-size: ${props.theme.typography.fontSize.xl};
          min-height: 56px;
        `;
      default: // md
        return css`
          padding: 0.5rem 1rem;
          font-size: ${props.theme.typography.fontSize.base};
          min-height: 40px;
        `;
    }
  }}

  /* Variant styles */
  ${props => {
    switch (props.variant) {
      case 'primary':
        return css`
          background: ${props.theme.colors.primary};
          color: white;
          border-color: ${props.theme.colors.primary};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primaryDark};
            border-color: ${props.theme.colors.primaryDark};
            transform: translateY(-1px);
            box-shadow: ${props.theme.shadows.md};
          }
          
          &:active:not(:disabled) {
            transform: translateY(0);
            box-shadow: ${props.theme.shadows.sm};
          }
        `;
      
      case 'secondary':
        return css`
          background: ${props.theme.colors.surface};
          color: ${props.theme.colors.text};
          border-color: ${props.theme.colors.border};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.hover};
            border-color: ${props.theme.colors.borderDark};
          }
          
          &:active:not(:disabled) {
            background: ${props.theme.colors.active};
          }
        `;
      
      case 'outline':
        return css`
          background: transparent;
          color: ${props.theme.colors.primary};
          border-color: ${props.theme.colors.primary};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primary};
            color: white;
            transform: translateY(-1px);
            box-shadow: ${props.theme.shadows.sm};
          }
        `;
      
      case 'ghost':
        return css`
          background: transparent;
          color: ${props.theme.colors.text};
          border-color: transparent;
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.hover};
          }
          
          &:active:not(:disabled) {
            background: ${props.theme.colors.active};
          }
        `;
      
      case 'danger':
        return css`
          background: ${props.theme.colors.error};
          color: white;
          border-color: ${props.theme.colors.error};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.errorDark};
            border-color: ${props.theme.colors.errorDark};
            transform: translateY(-1px);
            box-shadow: ${props.theme.shadows.md};
          }
        `;
      
      case 'success':
        return css`
          background: ${props.theme.colors.success};
          color: white;
          border-color: ${props.theme.colors.success};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.successDark};
            border-color: ${props.theme.colors.successDark};
            transform: translateY(-1px);
            box-shadow: ${props.theme.shadows.md};
          }
        `;
      
      case 'warning':
        return css`
          background: ${props.theme.colors.warning};
          color: white;
          border-color: ${props.theme.colors.warning};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.warningDark};
            border-color: ${props.theme.colors.warningDark};
            transform: translateY(-1px);
            box-shadow: ${props.theme.shadows.md};
          }
        `;
      
      default:
        return css`
          background: ${props.theme.colors.primary};
          color: white;
          border-color: ${props.theme.colors.primary};
          
          &:hover:not(:disabled) {
            background: ${props.theme.colors.primaryDark};
            border-color: ${props.theme.colors.primaryDark};
          }
        `;
    }
  }}

  /* Full width */
  ${props => props.fullWidth && css`
    width: 100%;
  `}

  /* Icon only */
  ${props => props.iconOnly && css`
    padding: ${props.size === 'sm' ? '0.375rem' : props.size === 'lg' ? '0.75rem' : '0.5rem'};
    aspect-ratio: 1;
  `}
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${props => {
    switch (props.size) {
      case 'xs':
        return css`width: 12px; height: 12px;`;
      case 'sm':
        return css`width: 16px; height: 16px;`;
      case 'lg':
        return css`width: 20px; height: 20px;`;
      case 'xl':
        return css`width: 24px; height: 24px;`;
      default:
        return css`width: 18px; height: 18px;`;
    }
  }}
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ContentWrapper = styled.span`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Main Button component
const Button = React.forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  iconOnly = false,
  leftIcon,
  rightIcon,
  loadingText,
  className,
  style,
  onClick,
  type = 'button',
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  const handleClick = (e) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <ContentWrapper>
          <ButtonSpinner size={size === 'xs' || size === 'sm' ? 'small' : 'small'} />
          {loadingText && <span>{loadingText}</span>}
        </ContentWrapper>
      );
    }

    if (iconOnly) {
      return leftIcon ? (
        <IconWrapper size={size}>{leftIcon}</IconWrapper>
      ) : children;
    }

    return (
      <ContentWrapper>
        {leftIcon && <IconWrapper size={size}>{leftIcon}</IconWrapper>}
        {children && <span>{children}</span>}
        {rightIcon && <IconWrapper size={size}>{rightIcon}</IconWrapper>}
      </ContentWrapper>
    );
  };

  return (
    <BaseButton
      ref={ref}
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      iconOnly={iconOnly}
      disabled={isDisabled}
      className={className}
      style={style}
      onClick={handleClick}
      type={type}
      {...props}
    >
      {renderContent()}
    </BaseButton>
  );
});

Button.displayName = 'Button';

// Specialized button components
export const PrimaryButton = (props) => <Button variant="primary" {...props} />;
export const SecondaryButton = (props) => <Button variant="secondary" {...props} />;
export const OutlineButton = (props) => <Button variant="outline" {...props} />;
export const GhostButton = (props) => <Button variant="ghost" {...props} />;
export const DangerButton = (props) => <Button variant="danger" {...props} />;
export const SuccessButton = (props) => <Button variant="success" {...props} />;
export const WarningButton = (props) => <Button variant="warning" {...props} />;

// Icon button component
export const IconButton = ({ icon, tooltip, size = 'md', ...props }) => (
  <Button
    iconOnly
    size={size}
    title={tooltip}
    leftIcon={icon}
    {...props}
  />
);

// Button group component
const ButtonGroupContainer = styled.div`
  display: inline-flex;
  
  ${BaseButton} {
    &:not(:first-child) {
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      margin-left: -1px;
    }
    
    &:not(:last-child) {
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
    }
    
    &:hover {
      z-index: 1;
    }
    
    &:focus {
      z-index: 2;
    }
  }

  ${props => props.vertical && `
    flex-direction: column;
    
    ${BaseButton} {
      &:not(:first-child) {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
        border-bottom-left-radius: ${props.theme.borderRadius.md};
        margin-left: 0;
        margin-top: -1px;
      }
      
      &:not(:last-child) {
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-top-right-radius: ${props.theme.borderRadius.md};
      }
    }
  `}
`;

export const ButtonGroup = ({ children, vertical = false, className, style }) => (
  <ButtonGroupContainer vertical={vertical} className={className} style={style}>
    {children}
  </ButtonGroupContainer>
);

// Floating Action Button
const FABContainer = styled(BaseButton)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  padding: 0;
  box-shadow: ${props => props.theme.shadows.lg};
  z-index: 1000;
  
  &:hover:not(:disabled) {
    box-shadow: ${props => props.theme.shadows.xl};
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    bottom: 1rem;
    right: 1rem;
    width: 48px;
    height: 48px;
  }
`;

export const FloatingActionButton = ({ icon, onClick, variant = 'primary', ...props }) => (
  <FABContainer
    variant={variant}
    onClick={onClick}
    iconOnly
    {...props}
  >
    <IconWrapper size="lg">{icon}</IconWrapper>
  </FABContainer>
);

// Link button (styled as button but behaves like link)
export const LinkButton = styled.button`
  background: none;
  border: none;
  color: ${props => props.theme.colors.primary};
  cursor: pointer;
  font-size: inherit;
  font-family: inherit;
  text-decoration: underline;
  padding: 0;
  
  &:hover {
    color: ${props => props.theme.colors.primaryDark};
  }
  
  &:focus {
    outline: 2px solid ${props => props.theme.colors.focus};
    outline-offset: 2px;
  }
  
  &:disabled {
    color: ${props => props.theme.colors.textMuted};
    cursor: not-allowed;
  }
`;

// Toggle button
const ToggleButtonContainer = styled(BaseButton)`
  ${props => props.active && `
    background: ${props.theme.colors.primary};
    color: white;
    border-color: ${props.theme.colors.primary};
  `}
`;

export const ToggleButton = ({ active, children, onChange, ...props }) => (
  <ToggleButtonContainer
    variant="outline"
    active={active}
    onClick={() => onChange?.(!active)}
    {...props}
  >
    {children}
  </ToggleButtonContainer>
);

// Copy button with feedback
export const CopyButton = ({ textToCopy, children = 'Copy', onCopy, ...props }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      onCopy?.(textToCopy);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  return (
    <Button
      variant={copied ? 'success' : 'outline'}
      onClick={handleCopy}
      {...props}
    >
      {copied ? '✓ Copied!' : children}
    </Button>
  );
};

export default Button;