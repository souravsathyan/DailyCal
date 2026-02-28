import { useRef, useCallback } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { readAsStringAsync, EncodingType } from "expo-file-system/legacy";
import BottomSheet from "@gorhom/bottom-sheet";
import FoodScanSheet from "@/components/FoodScanSheet";

export default function HomeScreen() {
  const router = useRouter();
  const sheetRef = useRef<BottomSheet>(null);

  const openSheet = useCallback(() => {
    sheetRef.current?.expand();
  }, []);

  const handleCamera = useCallback(() => {
    sheetRef.current?.close();
    router.push("/food-scan");
  }, [router]);

  const handleGallery = useCallback(async () => {
    sheetRef.current?.close();

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") return;

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
      base64: false,
    });

    if (pickerResult.canceled || !pickerResult.assets[0]?.uri) return;

    const uri = pickerResult.assets[0].uri;
    const base64 = await readAsStringAsync(uri, {
      encoding: EncodingType.Base64,
    });

    router.push({
      pathname: "/food-scan-result",
      params: { base64Image: base64 },
    });
  }, [router]);

  return (
    <View className="flex-1 bg-background">
      {/* Content area */}
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-semibold text-foreground text-center mb-2">
          Welcome to DailyCal 👋
        </Text>
        <Text className="text-sm text-default-500 text-center">
          Scan your food to track calories instantly
        </Text>
      </View>

      {/* Scan FAB */}
      <View className="absolute bottom-10 left-0 right-0 items-center">
        <Pressable
          onPress={openSheet}
          className="bg-primary flex-row items-center gap-2 px-8 py-4 rounded-full shadow-lg"
        >
          <Text className="text-xl">📷</Text>
          <Text className="text-white font-semibold text-base">Scan Food</Text>
        </Pressable>
      </View>

      {/* Bottom Sheet */}
      <FoodScanSheet
        ref={sheetRef}
        onCamera={handleCamera}
        onGallery={handleGallery}
      />
    </View>
  );
}
