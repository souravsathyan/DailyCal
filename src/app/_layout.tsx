import { Stack } from "expo-router";
import EdgeToEdgeView from "@/components/EdgeToEdge";
import { HeroUINativeProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Uniwind } from "uniwind";
import "../../global.css";
import { useFonts } from "expo-font";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

// Forcing light theme as requested
Uniwind.setTheme("light");

const RootStack = () => {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
};

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);
  if (!fontsLoaded && !error) return null;

  return (
    <EdgeToEdgeView>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HeroUINativeProvider>
          <RootStack />
        </HeroUINativeProvider>
      </GestureHandlerRootView>
    </EdgeToEdgeView>
  );
}
