import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { Input, PasswordInput, FormContainer } from '../components/UI/Form';
import Button from '../components/UI/Button';
import { Checkbox } from '../components/UI/Form';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { 
  EnvelopeIcon, 
  LockClosedIcon,
  EyeIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline';

// Page container
const PageContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: linear-gradient(135deg, 
    ${props => props.theme.colors.primary}10 0%, 
    ${props => props.theme.colors.background} 50%,
    ${props => props.theme.colors.secondary}05 100%
  );
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 400px;
  background: ${props => props.theme.colors.surface};
  border-radius: ${props => props.theme.borderRadius.xl};
  box-shadow: ${props => props.theme.shadows.xl};
  padding: 2rem;
  border: 1px solid ${props => props.theme.colors.border};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      ${props => props.theme.colors.primary}, 
      ${props => props.theme.colors.secondary}
    );
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Logo = styled.div`
  width: 60px;
  height: 60px;
  background: ${props => props.theme.colors.primary};
  border-radius: ${props => props.theme.borderRadius.xl};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
  color: white;
  font-size: 1.5rem;
  font-weight: bold;
`;

const Title = styled.h1`
  font-size: ${props => props.theme.typography.fontSize['2xl']};
  font-weight: ${props => props.theme.typography.fontWeight.bold};
  color: ${props => props.theme.colors.text};
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: ${props => props.theme.colors.textSecondary};
  margin: 0;
`;

const FormSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ForgotLink = styled(Link)`
  color: ${props => props.theme.colors.primary};
  text-decoration: none;
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-bottom: 1.5rem;
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  margin: 1.5rem 0;
  
  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: ${props => props.theme.colors.border};
  }
  
  span {
    padding: 0 1rem;
    color: ${props => props.theme.colors.textMuted};
    font-size: ${props => props.theme.typography.fontSize.sm};
  }
`;

const SignupPrompt = styled.div`
  text-align: center;
  color: ${props => props.theme.colors.textSecondary};
  font-size: ${props => props.theme.typography.fontSize.sm};
  
  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    font-weight: ${props => props.theme.typography.fontWeight.medium};
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const DemoSection = styled.div`
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.lg};
  padding: 1rem;
  margin-top: 1.5rem;
  border: 1px solid ${props => props.theme.colors.border};
`;

const DemoTitle = styled.h4`
  margin: 0 0 0.5rem 0;
  color: ${props => props.theme.colors.text};
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
`;

const DemoCredentials = styled.div`
  font-size: ${props => props.theme.typography.fontSize.xs};
  color: ${props => props.theme.colors.textMuted};
  font-family: ${props => props.theme.typography.fontFamily.mono};
  
  div {
    margin-bottom: 0.25rem;
  }
`;

const DemoButton = styled(Button)`
  width: 100%;
  margin-top: 0.75rem;
`;

const ThemeToggle = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border: none;
  background: ${props => props.theme.colors.hover};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${props => props.theme.colors.text};
  transition: all ${props => props.theme.transitions.fast};
  
  &:hover {
    background: ${props => props.theme.colors.active};
    transform: scale(1.05);
  }
  
  svg {
    width: 20px;
    height: 20px;
  }
`;

const ErrorAlert = styled.div`
  background: ${props => props.theme.colors.error}10;
  border: 1px solid ${props => props.theme.colors.error}30;
  color: ${props => props.theme.colors.error};
  padding: 0.75rem;
  border-radius: ${props => props.theme.borderRadius.md};
  margin-bottom: 1rem;
  font-size: ${props => props.theme.typography.fontSize.sm};
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const LoginPage = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Get redirect path from location state
  const from = location.state?.from?.pathname || '/dashboard';

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form field changes
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
    
    // Clear global error
    if (error) {
      clearError();
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        showSuccess(`Welcome back, ${result.user.name}!`);
        navigate(from, { replace: true });
      } else {
        showError(result.error || 'Login failed');
      }
    } catch (err) {
      showError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle demo login
  const handleDemoLogin = async () => {
    setFormData({
      email: 'john.doe@example.com',
      password: 'Password123',
      rememberMe: false
    });
    
    // Simulate user typing and then submit
    setTimeout(async () => {
      setIsSubmitting(true);
      try {
        const result = await login('john.doe@example.com', 'Password123');
        if (result.success) {
          showSuccess(`Welcome to the demo, ${result.user.name}!`);
          navigate(from, { replace: true });
        } else {
          showError(result.error || 'Demo login failed');
        }
      } catch (err) {
        showError('Demo login failed');
      } finally {
        setIsSubmitting(false);
      }
    }, 500);
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Signing you in..." />;
  }

  return (
    <PageContainer>
      <LoginCard>
        <ThemeToggle onClick={toggleTheme}>
          {isDark() ? <SunIcon /> : <MoonIcon />}
        </ThemeToggle>

        <Header>
          <Logo>N</Logo>
          <Title>Welcome back</Title>
          <Subtitle>Sign in to your account to continue</Subtitle>
        </Header>

        <FormContainer onSubmit={handleSubmit}>
          {error && (
            <ErrorAlert>
              <ExclamationTriangleIcon style={{ width: 16, height: 16 }} />
              {error}
            </ErrorAlert>
          )}

          <FormSection>
            <Input
              type="email"
              label="Email address"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              error={validationErrors.email}
              leftIcon={<EnvelopeIcon />}
              required
              autoComplete="email"
              autoFocus
            />
          </FormSection>

          <FormSection>
            <PasswordInput
              label="Password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={validationErrors.password}
              required
              autoComplete="current-password"
            />
          </FormSection>

          <FormRow>
            <Checkbox
              label="Remember me"
              checked={formData.rememberMe}
              onChange={(e) => handleChange('rememberMe', e.target.checked)}
            />
            <ForgotLink to="/forgot-password">
              Forgot password?
            </ForgotLink>
          </FormRow>

          <SubmitButton
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            loadingText="Signing in..."
            disabled={isSubmitting}
          >
            Sign In
          </SubmitButton>
        </FormContainer>

        <DemoSection>
          <DemoTitle>Try the Demo</DemoTitle>
          <DemoCredentials>
            <div>Email: john.doe@example.com</div>
            <div>Password: Password123</div>
          </DemoCredentials>
          <DemoButton
            variant="outline"
            size="sm"
            onClick={handleDemoLogin}
            disabled={isSubmitting}
          >
            Sign in with Demo Account
          </DemoButton>
        </DemoSection>

        <Divider>
          <span>or</span>
        </Divider>

        <SignupPrompt>
          Don't have an account?{' '}
          <Link to="/register">Create one here</Link>
        </SignupPrompt>
      </LoginCard>
    </PageContainer>
  );
};

export default LoginPage;