import React, { useMemo } from 'react';
import { View, ViewStyle, StatusBar, Platform, useColorScheme } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useUniwind } from 'uniwind';

interface EdgeToEdgeViewProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  excludeTop?: boolean;
  excludeBottom?: boolean;
  excludeLeft?: boolean;
  excludeRight?: boolean;
  statusBarStyle?: 'default' | 'light-content' | 'dark-content';
  statusBarBackgroundColor?: string;
  edges?: ('top' | 'bottom' | 'left' | 'right')[];
}

const EdgeToEdgeView: React.FC<EdgeToEdgeViewProps> = ({
  children,
  style,
  excludeTop = false,
  excludeBottom = false,
  excludeLeft = false,
  excludeRight = false,
  statusBarStyle,
  statusBarBackgroundColor,
  edges = ['top', 'bottom', 'left', 'right'],
}) => {
  const insets = useSafeAreaInsets();
  
  // Force a re-render if OS phone setting changes while app is active
  useColorScheme();
  
  const { theme } = useUniwind();
  const isDarkOrEquivalent = theme === 'dark';

  const barStyle = statusBarStyle || (isDarkOrEquivalent ? 'light-content' : 'dark-content');

  const containerStyle = useMemo<ViewStyle>(() => ({
    paddingTop: excludeTop || !edges.includes('top') ? 0 : insets.top,
    paddingBottom: excludeBottom || !edges.includes('bottom') ? 0 : insets.bottom,
    paddingLeft: excludeLeft || !edges.includes('left') ? 0 : insets.left,
    paddingRight: excludeRight || !edges.includes('right') ? 0 : insets.right,
  }), [insets, excludeTop, excludeBottom, excludeLeft, excludeRight, edges]);

  return (
    <View style={[containerStyle, style]} className="flex-1 bg-white">
      <StatusBar
        barStyle={barStyle}
        backgroundColor={statusBarBackgroundColor || 'transparent'}
        translucent={Platform.OS === 'android'}
      />
      {children}
    </View>
  );
};

export default EdgeToEdgeView;
