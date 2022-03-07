import React from 'react';

// Context for toggling theme light/dark or getting current theme
export const ThemeContext = React.createContext({
  theme: 'light',
  toggleTheme: () => {},
});
