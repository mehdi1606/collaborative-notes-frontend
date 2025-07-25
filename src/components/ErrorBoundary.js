import React from 'react';
import styled from 'styled-components';
import Button from './UI/Button';
import { ExclamationTriangleIcon, ArrowPathIcon, HomeIcon } from '@heroicons/react/24/outline';

// Error boundary container
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  text-align: center;
  background: ${props => props.theme?.colors?.background || '#ffffff'};
`;

const ErrorContent = styled.div`
  max-width: 500px;
  width: 100%;
`;

const ErrorIcon = styled.div`
  width: 80px;
  height: 80px;
  margin: 0 auto 2rem;
  color: ${props => props.theme?.colors?.error || '#ef4444'};
  
  svg {
    width: 100%;
    height: 100%;
  }
`;

const ErrorTitle = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: ${props => props.theme?.colors?.text || '#1e293b'};
  margin: 0 0 1rem 0;
`;

const ErrorMessage = styled.p`
  font-size: 1.125rem;
  color: ${props => props.theme?.colors?.textSecondary || '#64748b'};
  margin: 0 0 2rem 0;
  line-height: 1.6;
`;

const ErrorDetails = styled.details`
  margin: 2rem 0;
  padding: 1rem;
  background: ${props => props.theme?.colors?.backgroundSecondary || '#f8fafc'};
  border-radius: 8px;
  border: 1px solid ${props => props.theme?.colors?.border || '#e2e8f0'};
  text-align: left;
  
  summary {
    cursor: pointer;
    font-weight: 600;
    color: ${props => props.theme?.colors?.text || '#1e293b'};
    margin-bottom: 0.5rem;
    
    &:hover {
      color: ${props => props.theme?.colors?.primary || '#2563eb'};
    }
  }
`;

const ErrorStack = styled.pre`
  font-size: 0.875rem;
  color: ${props => props.theme?.colors?.textMuted || '#94a3b8'};
  background: ${props => props.theme?.colors?.background || '#ffffff'};
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-word;
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // Store error details in state
    this.setState({
      error,
      errorInfo,
      eventId: this.generateEventId()
    });

    // Report error to monitoring service (if available)
    this.reportError(error, errorInfo);
  }

  generateEventId = () => {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  };

  reportError = (error, errorInfo) => {
    // Here you would typically send the error to a monitoring service
    // like Sentry, LogRocket, or your own error tracking system
    try {
      const errorData = {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        eventId: this.state.eventId
      };

      // Example: Send to your error reporting service
      // fetch('/api/errors', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(errorData)
      // });

      console.log('Error reported:', errorData);
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  handleRetry = () => {
    // Clear error state to retry rendering
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      eventId: null
    });
  };

  handleGoHome = () => {
    // Navigate to home page
    window.location.href = '/dashboard';
  };

  handleReload = () => {
    // Reload the entire page
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const { error, errorInfo, eventId } = this.state;
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <ErrorContainer>
          <ErrorContent>
            <ErrorIcon>
              <ExclamationTriangleIcon />
            </ErrorIcon>
            
            <ErrorTitle>
              Something went wrong
            </ErrorTitle>
            
            <ErrorMessage>
              We're sorry, but something unexpected happened. Our team has been notified and is working on a fix.
            </ErrorMessage>

            {eventId && (
              <ErrorMessage style={{ fontSize: '0.875rem', opacity: 0.8 }}>
                Error ID: {eventId}
              </ErrorMessage>
            )}

            <ActionButtons>
              <Button
                variant="primary"
                leftIcon={<ArrowPathIcon />}
                onClick={this.handleRetry}
              >
                Try Again
              </Button>
              
              <Button
                variant="outline"
                leftIcon={<HomeIcon />}
                onClick={this.handleGoHome}
              >
                Go Home
              </Button>
              
              <Button
                variant="ghost"
                onClick={this.handleReload}
              >
                Reload Page
              </Button>
            </ActionButtons>

            {isDevelopment && error && (
              <ErrorDetails>
                <summary>Error Details (Development)</summary>
                <ErrorStack>
                  <strong>Error:</strong> {error.toString()}
                  {error.stack && (
                    <>
                      <br /><br />
                      <strong>Stack Trace:</strong>
                      <br />
                      {error.stack}
                    </>
                  )}
                  {errorInfo?.componentStack && (
                    <>
                      <br /><br />
                      <strong>Component Stack:</strong>
                      <br />
                      {errorInfo.componentStack}
                    </>
                  )}
                </ErrorStack>
              </ErrorDetails>
            )}
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

// HOC for wrapping components with error boundary
export const withErrorBoundary = (WrappedComponent, fallback) => {
  const WithErrorBoundaryComponent = (props) => (
    <ErrorBoundary fallback={fallback}>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );

  WithErrorBoundaryComponent.displayName = `withErrorBoundary(${WrappedComponent.displayName || WrappedComponent.name})`;
  
  return WithErrorBoundaryComponent;
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const [error, setError] = React.useState(null);

  const resetError = React.useCallback(() => {
    setError(null);
  }, []);

  const handleError = React.useCallback((error) => {
    console.error('Error caught by useErrorHandler:', error);
    setError(error);
  }, []);

  // Throw error to be caught by error boundary
  React.useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { handleError, resetError };
};

// Async error boundary for handling promise rejections
export class AsyncErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Async Error Boundary caught an error:', error, errorInfo);
  }

  componentDidMount() {
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  componentWillUnmount() {
    window.removeEventListener('unhandledrejection', this.handleUnhandledRejection);
  }

  handleUnhandledRejection = (event) => {
    console.error('Unhandled promise rejection:', event.reason);
    this.setState({ hasError: true, error: event.reason });
    event.preventDefault(); // Prevent the default browser behavior
  };

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <ErrorContainer>
          <ErrorContent>
            <ErrorIcon>
              <ExclamationTriangleIcon />
            </ErrorIcon>
            <ErrorTitle>Async Error</ErrorTitle>
            <ErrorMessage>
              An asynchronous operation failed. Please try again.
            </ErrorMessage>
            <Button onClick={() => this.setState({ hasError: false, error: null })}>
              Retry
            </Button>
          </ErrorContent>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;