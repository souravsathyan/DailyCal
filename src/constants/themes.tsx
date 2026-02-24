export const lightTheme = {
  background: '#F9F9F9',
  text: '#333333',
  text2: '#9F9F9F',
  primary: '#13616E',
  secondaryText: '#161616',
  tertiaryText: '#BFBFBF',
  courseCard: {
    purchaseText: '#282828',
    createdText: '#444444', 
  }
};

export const darkTheme = {
  background: '#101010',
  text: '#E0E0E0',
  text2: '#D7D7D7',
  primary: '#13616E',
  secondaryText: '#E0E0E0',
  tertiaryText: '#BFBFBF',
  courseCard: {
    purchaseText: '#AAAAAA',
    createdText: '#A1A1A1', 
  }
};

// Add as many as you want here!
export const oceanTheme = {
  background: '#0a192f',
  text: '#ccd6f6',
  text2: '#8892b0',
  primary: '#64ffda',
  secondaryText: '#a8b2d1',
  tertiaryText: '#8892b0',
  courseCard: {
    purchaseText: '#e6f1ff',
    createdText: '#8892b0', 
  }
};

// Type definition based on one of the themes ensuring they all match
export type ThemeType = typeof lightTheme;

// Combine them into a dictionary
export const themeConfig = {
  light: lightTheme,
  dark: darkTheme,
  ocean: oceanTheme,
  // amoled: amoledTheme,
  // sepia: sepiaTheme...
};

// Type to restrict theme names to valid keys
export type ThemeName = keyof typeof themeConfig;
