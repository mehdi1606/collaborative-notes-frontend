import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

// Theme definitions
const lightTheme = {
  name: 'light',
  colors: {
    // Primary colors
    primary: '#2563eb',
    primaryLight: '#3b82f6',
    primaryDark: '#1d4ed8',
    secondary: '#64748b',
    secondaryLight: '#94a3b8',
    secondaryDark: '#475569',
    
    // Status colors
    success: '#10b981',
    successLight: '#34d399',
    successDark: '#059669',
    warning: '#f59e0b',
    warningLight: '#fbbf24',
    warningDark: '#d97706',
    error: '#ef4444',
    errorLight: '#f87171',
    errorDark: '#dc2626',
    info: '#3b82f6',
    infoLight: '#60a5fa',
    infoDark: '#2563eb',
    
    // Neutral colors
    background: '#ffffff',
    backgroundSecondary: '#f8fafc',
    backgroundTertiary: '#f1f5f9',
    surface: '#ffffff',
    surfaceSecondary: '#f8fafc',
    text: '#1e293b',
    textSecondary: '#475569',
    textMuted: '#64748b',
    textLight: '#94a3b8',
    
    // Border colors
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    borderDark: '#cbd5e1',
    
    // Interactive colors
    hover: '#f1f5f9',
    active: '#e2e8f0',
    focus: '#dbeafe',
    disabled: '#f1f5f9',
    
    // Sidebar specific
    sidebarBackground: '#1e293b',
    sidebarText: '#cbd5e1',
    sidebarTextActive: '#ffffff',
    sidebarHover: '#334155',
    
    // Note status colors
    notePrivate: '#64748b',
    noteShared: '#3b82f6',
    notePublic: '#10b981'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    full: '9999px'
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    xxl: '3rem'
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['Fira Code', 'Monaco', 'Consolas', 'monospace']
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out'
  },
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px'
  }
};

const darkTheme = {
  ...lightTheme,
  name: 'dark',
  colors: {
    ...lightTheme.colors,
    // Primary colors (keep same)
    primary: '#3b82f6',
    primaryLight: '#60a5fa',
    primaryDark: '#2563eb',
    
    // Background colors
    background: '#0f172a',
    backgroundSecondary: '#1e293b',
    backgroundTertiary: '#334155',
    surface: '#1e293b',
    surfaceSecondary: '#334155',
    
    // Text colors
    text: '#f1f5f9',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    textLight: '#64748b',
    
    // Border colors
    border: '#334155',
    borderLight: '#475569',
    borderDark: '#1e293b',
    
    // Interactive colors
    hover: '#334155',
    active: '#475569',
    focus: '#1e40af',
    disabled: '#334155',
    
    // Sidebar specific
    sidebarBackground: '#0f172a',
    sidebarText: '#94a3b8',
    sidebarTextActive: '#f1f5f9',
    sidebarHover: '#1e293b'
  }
};

// Theme action types
const THEME_ACTIONS = {
  SET_THEME: 'SET_THEME',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_FONT_SIZE: 'SET_FONT_SIZE',
  SET_SIDEBAR_COLLAPSED: 'SET_SIDEBAR_COLLAPSED',
  RESET_THEME: 'RESET_THEME'
};

// Initial state
const initialState = {
  currentTheme: 'light',
  themes: {
    light: lightTheme,
    dark: darkTheme
  },
  fontSize: 'base',
  sidebarCollapsed: false,
  preferences: {
    animations: true,
    reducedMotion: false,
    highContrast: false
  }
};

// Theme reducer
const themeReducer = (state, action) => {
  switch (action.type) {
    case THEME_ACTIONS.SET_THEME:
      return {
        ...state,
        currentTheme: action.payload
      };

    case THEME_ACTIONS.TOGGLE_THEME:
      return {
        ...state,
        currentTheme: state.currentTheme === 'light' ? 'dark' : 'light'
      };

    case THEME_ACTIONS.SET_FONT_SIZE:
      return {
        ...state,
        fontSize: action.payload
      };

    case THEME_ACTIONS.SET_SIDEBAR_COLLAPSED:
      return {
        ...state,
        sidebarCollapsed: action.payload
      };

    case THEME_ACTIONS.RESET_THEME:
      return {
        ...initialState,
        themes: state.themes
      };

    default:
      return state;
  }
};

// Create context
const ThemeContext = createContext();

// Theme provider component
export const ThemeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(themeReducer, initialState);

  // Load theme preferences from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      const savedFontSize = localStorage.getItem('fontSize');
      const savedSidebarCollapsed = localStorage.getItem('sidebarCollapsed');

      if (savedTheme && ['light', 'dark'].includes(savedTheme)) {
        dispatch({ type: THEME_ACTIONS.SET_THEME, payload: savedTheme });
      }

      if (savedFontSize) {
        dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: savedFontSize });
      }

      if (savedSidebarCollapsed) {
        dispatch({ 
          type: THEME_ACTIONS.SET_SIDEBAR_COLLAPSED, 
          payload: JSON.parse(savedSidebarCollapsed) 
        });
      }
    } catch (error) {
      console.error('Error loading theme preferences:', error);
    }
  }, []);

  // Save theme preferences to localStorage
  useEffect(() => {
    localStorage.setItem('theme', state.currentTheme);
  }, [state.currentTheme]);

  useEffect(() => {
    localStorage.setItem('fontSize', state.fontSize);
  }, [state.fontSize]);

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(state.sidebarCollapsed));
  }, [state.sidebarCollapsed]);

  // Detect system theme preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      // Only auto-switch if no manual preference is saved
      if (!localStorage.getItem('theme')) {
        dispatch({ 
          type: THEME_ACTIONS.SET_THEME, 
          payload: e.matches ? 'dark' : 'light' 
        });
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    
    // Set initial theme based on system preference if no saved preference
    if (!localStorage.getItem('theme')) {
      dispatch({ 
        type: THEME_ACTIONS.SET_THEME, 
        payload: mediaQuery.matches ? 'dark' : 'light' 
      });
    }

    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  // Theme functions
  const setTheme = (themeName) => {
    if (state.themes[themeName]) {
      dispatch({ type: THEME_ACTIONS.SET_THEME, payload: themeName });
    }
  };

  const toggleTheme = () => {
    dispatch({ type: THEME_ACTIONS.TOGGLE_THEME });
  };

  const setFontSize = (size) => {
    dispatch({ type: THEME_ACTIONS.SET_FONT_SIZE, payload: size });
  };

  const setSidebarCollapsed = (collapsed) => {
    dispatch({ type: THEME_ACTIONS.SET_SIDEBAR_COLLAPSED, payload: collapsed });
  };

  const resetTheme = () => {
    localStorage.removeItem('theme');
    localStorage.removeItem('fontSize');
    localStorage.removeItem('sidebarCollapsed');
    dispatch({ type: THEME_ACTIONS.RESET_THEME });
  };

  // Get current theme object with font size applied
  const getCurrentTheme = () => {
    const baseTheme = state.themes[state.currentTheme];
    return {
      ...baseTheme,
      typography: {
        ...baseTheme.typography,
        fontSize: {
          ...baseTheme.typography.fontSize,
          base: baseTheme.typography.fontSize[state.fontSize]
        }
      }
    };
  };

  // Utility functions
  const isDark = () => state.currentTheme === 'dark';
  const isLight = () => state.currentTheme === 'light';

  // Context value
  const value = {
    // State
    currentTheme: state.currentTheme,
    themes: state.themes,
    fontSize: state.fontSize,
    sidebarCollapsed: state.sidebarCollapsed,
    preferences: state.preferences,
    theme: getCurrentTheme(),
    
    // Actions
    setTheme,
    toggleTheme,
    setFontSize,
    setSidebarCollapsed,
    resetTheme,
    
    // Utilities
    isDark,
    isLight,
    getCurrentTheme
  };

  return (
    <ThemeContext.Provider value={value}>
      <StyledThemeProvider theme={getCurrentTheme()}>
        {children}
      </StyledThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use theme context
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export default ThemeContext;