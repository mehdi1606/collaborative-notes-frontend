import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';
import { Input, PasswordInput, FormContainer } from '../components/UI/Form';
import Button from '../components/UI/Button';
import { Checkbox } from '../components/UI/Form';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { 
  UserIcon,
  EnvelopeIcon, 
  LockClosedIcon,
  CheckIcon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

// Reuse styled components from LoginPage
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

const RegisterCard = styled.div`
  width: 100%;
  max-width: 450px;
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

const PasswordRequirements = styled.div`
  margin-top: 0.5rem;
  padding: 0.75rem;
  background: ${props => props.theme.colors.backgroundSecondary};
  border-radius: ${props => props.theme.borderRadius.md};
  border: 1px solid ${props => props.theme.colors.border};
`;

const RequirementTitle = styled.div`
  font-size: ${props => props.theme.typography.fontSize.sm};
  font-weight: ${props => props.theme.typography.fontWeight.medium};
  color: ${props => props.theme.colors.text};
  margin-bottom: 0.5rem;
`;

const RequirementList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

const RequirementItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: ${props => props.theme.typography.fontSize.xs};
  margin-bottom: 0.25rem;
  color: ${props => props.valid ? props.theme.colors.success : props.theme.colors.textMuted};
  
  svg {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
  }
`;

const SubmitButton = styled(Button)`
  width: 100%;
  margin-bottom: 1.5rem;
`;

const Terms = styled.div`
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

const LoginPrompt = styled.div`
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

const RegisterPage = () => {
  const { register, isLoading, error, clearError } = useAuth();
  const { showSuccess, showError } = useNotification();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  
  const [validationErrors, setValidationErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  // Clear error when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);

  // Check password requirements
  useEffect(() => {
    const password = formData.password;
    setPasswordRequirements({
      length: password.length >= 6,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password)
    });
  }, [formData.password]);

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      errors.name = 'Name must be at least 2 characters';
    }
    
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Password is required';
    } else {
      const reqs = passwordRequirements;
      if (!reqs.length || !reqs.uppercase || !reqs.lowercase || !reqs.number) {
        errors.password = 'Password must meet all requirements';
      }
    }
    
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.acceptTerms) {
      errors.acceptTerms = 'You must accept the terms and conditions';
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
      const result = await register(
        formData.name.trim(),
        formData.email,
        formData.password
      );
      
      if (result.success) {
        showSuccess(`Welcome to Notes, ${result.user.name}! Your account has been created.`);
        navigate('/dashboard', { replace: true });
      } else {
        showError(result.error || 'Registration failed');
      }
    } catch (err) {
      showError('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen text="Creating your account..." />;
  }

  return (
    <PageContainer>
      <RegisterCard>
        <ThemeToggle onClick={toggleTheme}>
          {isDark() ? <SunIcon /> : <MoonIcon />}
        </ThemeToggle>

        <Header>
          <Logo>N</Logo>
          <Title>Create your account</Title>
          <Subtitle>Join us and start organizing your notes</Subtitle>
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
              type="text"
              label="Full name"
              placeholder="Enter your full name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              error={validationErrors.name}
              leftIcon={<UserIcon />}
              required
              autoComplete="name"
              autoFocus
            />
          </FormSection>

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
            />
          </FormSection>

          <FormSection>
            <PasswordInput
              label="Password"
              placeholder="Create a password"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              error={validationErrors.password}
              required
              autoComplete="new-password"
            />
            
            {formData.password && (
              <PasswordRequirements>
                <RequirementTitle>Password Requirements</RequirementTitle>
                <RequirementList>
                  <RequirementItem valid={passwordRequirements.length}>
                    {passwordRequirements.length ? <CheckIcon /> : <XMarkIcon />}
                    At least 6 characters
                  </RequirementItem>
                  <RequirementItem valid={passwordRequirements.uppercase}>
                    {passwordRequirements.uppercase ? <CheckIcon /> : <XMarkIcon />}
                    One uppercase letter
                  </RequirementItem>
                  <RequirementItem valid={passwordRequirements.lowercase}>
                    {passwordRequirements.lowercase ? <CheckIcon /> : <XMarkIcon />}
                    One lowercase letter
                  </RequirementItem>
                  <RequirementItem valid={passwordRequirements.number}>
                    {passwordRequirements.number ? <CheckIcon /> : <XMarkIcon />}
                    One number
                  </RequirementItem>
                </RequirementList>
              </PasswordRequirements>
            )}
          </FormSection>

          <FormSection>
            <PasswordInput
              label="Confirm password"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(e) => handleChange('confirmPassword', e.target.value)}
              error={validationErrors.confirmPassword}
              required
              autoComplete="new-password"
            />
          </FormSection>

          <Terms>
            <Checkbox
              label={
                <>
                  I agree to the{' '}
                  <Link to="/terms" target="_blank">Terms of Service</Link>
                  {' '}and{' '}
                  <Link to="/privacy" target="_blank">Privacy Policy</Link>
                </>
              }
              checked={formData.acceptTerms}
              onChange={(e) => handleChange('acceptTerms', e.target.checked)}
              error={validationErrors.acceptTerms}
              required
            />
          </Terms>

          <SubmitButton
            type="submit"
            variant="primary"
            size="lg"
            loading={isSubmitting}
            loadingText="Creating account..."
            disabled={isSubmitting}
          >
            Create Account
          </SubmitButton>
        </FormContainer>

        <Divider>
          <span>or</span>
        </Divider>

        <LoginPrompt>
          Already have an account?{' '}
          <Link to="/login">Sign in here</Link>
        </LoginPrompt>
      </RegisterCard>
    </PageContainer>
  );
};

export default RegisterPage;