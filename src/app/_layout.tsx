import { Stack } from "expo-router";
import EdgeToEdgeView from "@/components/EdgeToEdge";
import { HeroUINativeProvider, ToastProvider } from "heroui-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
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
import { useAuthStore } from "@/store/useAuthStore";

SplashScreen.preventAutoHideAsync();

// Forcing light theme as requested
Uniwind.setTheme("light");

const RootStack = () => {
  const { session, isHydrated } = useAuthStore();

  useEffect(() => {
    if (!isHydrated) return;
  }, [session]);

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>
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

  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if ((fontsLoaded || error) && isHydrated) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error, isHydrated]);

  if (!fontsLoaded && !error) return null;
  if (!isHydrated) return null;

  return (
    <EdgeToEdgeView>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <HeroUINativeProvider>
          <ToastProvider defaultProps={{ placement: "bottom" }}>
            <KeyboardProvider>
              <RootStack />
            </KeyboardProvider>
          </ToastProvider>
        </HeroUINativeProvider>
      </GestureHandlerRootView>
    </EdgeToEdgeView>
  );
}
