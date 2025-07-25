import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import LoadingSpinner from './components/UI/LoadingSpinner';
import NotificationContainer from './components/UI/NotificationContainer';
import ErrorBoundary from './components/ErrorBoundary';

// Pages
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotesPage from './pages/NotesPage';
import NoteDetailPage from './pages/NoteDetailPage';
import CreateNotePage from './pages/CreateNotePage';
import EditNotePage from './pages/EditNotePage';
import SharedNotesPage from './pages/SharedNotesPage';
import PublicNotePage from './pages/PublicNotePage';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';

// Styled Components
import styled from 'styled-components';

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
  color: ${props => props.theme.colors.text};
  transition: background-color 0.3s ease, color 0.3s ease;
`;

const MainContent = styled.div`
  display: flex;
  min-height: calc(100vh - 60px); /* Account for navbar height */
`;

const ContentArea = styled.main`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  
  @media (max-width: 768px) {
    padding: 0.5rem;
  }
`;

const SidebarToggle = styled.button`
  display: none;
  position: fixed;
  top: 70px;
  left: 1rem;
  z-index: 1000;
  background: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Public Route Component (redirects if authenticated)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// Main App Layout Component
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(window.innerWidth <= 768);

  React.useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AppContainer>
      <Navbar />
      <MainContent>
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <ContentArea>
          {isMobile && (
            <SidebarToggle onClick={toggleSidebar}>
              ☰
            </SidebarToggle>
          )}
          {children}
        </ContentArea>
      </MainContent>
    </AppContainer>
  );
};

// Main App Component
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route 
                  path="/login" 
                  element={
                    <PublicRoute>
                      <LoginPage />
                    </PublicRoute>
                  } 
                />
                <Route 
                  path="/register" 
                  element={
                    <PublicRoute>
                      <RegisterPage />
                    </PublicRoute>
                  } 
                />
                
                {/* Public Note Route (no auth required) */}
                <Route 
                  path="/public/:token" 
                  element={<PublicNotePage />} 
                />

                {/* Protected Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <DashboardPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/notes" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <NotesPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/notes/new" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <CreateNotePage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/notes/:id" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <NoteDetailPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/notes/:id/edit" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <EditNotePage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/shared" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <SharedNotesPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/search" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <SearchPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <ProfilePage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/settings" 
                  element={
                    <ProtectedRoute>
                      <AppLayout>
                        <SettingsPage />
                      </AppLayout>
                    </ProtectedRoute>
                  } 
                />

                {/* Root redirect */}
                <Route 
                  path="/" 
                  element={<Navigate to="/dashboard" replace />} 
                />

                {/* 404 Route */}
                <Route 
                  path="*" 
                  element={<NotFoundPage />} 
                />
              </Routes>
              
              {/* Global Components */}
              <NotificationContainer />
            </Router>
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;