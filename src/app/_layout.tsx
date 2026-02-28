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
import { View, ActivityIndicator } from "react-native";

SplashScreen.preventAutoHideAsync();

// Forcing light theme as requested
Uniwind.setTheme("light");

const RootStack = () => {
  const { session, isHydrated, isOnboarded } = useAuthStore();

  // isOnboarded === null means still loading from DB → show loader
  const isLoading = !!session && isOnboarded === null;

  if (!isHydrated || isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack>
      {/* Logged in + onboarded → tabs */}
      <Stack.Protected guard={!!session && isOnboarded === true}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Logged in + not onboarded → onboarding */}
      <Stack.Protected guard={!!session && isOnboarded === false}>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Not logged in → auth */}
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      {/* Food scan modal screens — accessible when logged in */}
      <Stack.Screen
        name="food-scan"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
      <Stack.Screen
        name="food-scan-result"
        options={{ headerShown: false, presentation: "fullScreenModal" }}
      />
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
