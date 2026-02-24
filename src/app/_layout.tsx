import { Stack } from 'expo-router';
import EdgeToEdgeView from '@/components/EdgeToEdge';

const RootStack = () => {
    return (
        <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    )
}

export default function RootLayout() {
  return (
    <EdgeToEdgeView>
      <RootStack />
    </EdgeToEdgeView>
  );
}
