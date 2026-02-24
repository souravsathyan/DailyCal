import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Appearance } from 'react-native';
import { themeConfig, ThemeName, ThemeType } from '../constants/themes';
import { zustandStorage } from '../utils/zustandStorage';

interface ThemeState {
  // State
  explicitTheme: ThemeName | 'system';
  
  // Actions
  changeTheme: (themeName: ThemeName | 'system') => void;
  
  // Helper to fetch computed values without triggering React hooks inside actions
  getActiveThemeDetails: () => {
    activeThemeName: ThemeName;
    theme: ThemeType;
    isDarkOrEquivalent: boolean;
  };
}

// 3. Create the Store with Immer and Persist Middleware
export const useThemeStore = create<ThemeState>()(
  persist(
    immer((set, get) => ({
      explicitTheme: 'system',
      
      changeTheme: (themeName) => set((state) => {
        state.explicitTheme = themeName;
      }),
      
      getActiveThemeDetails: () => {
        const { explicitTheme } = get();
        const systemColorScheme = Appearance.getColorScheme();

        // Derive active name
        let activeThemeName: ThemeName;
        if (explicitTheme === 'system') {
          activeThemeName = systemColorScheme === 'dark' ? 'dark' : 'light';
        } else {
          activeThemeName = explicitTheme;
        }

        const theme = themeConfig[activeThemeName];
        const isDarkOrEquivalent = ['dark', 'ocean'].includes(activeThemeName);

        return { activeThemeName, theme, isDarkOrEquivalent };
      }
    })),
    {
      name: 'dailycal-theme', 
      storage: createJSONStorage(() => zustandStorage), 
    }
  )
);
