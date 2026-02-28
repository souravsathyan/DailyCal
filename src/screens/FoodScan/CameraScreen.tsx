import { CameraView, useCameraPermissions } from "expo-camera";
import { useRef, useState, useCallback } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { readAsStringAsync, EncodingType } from "expo-file-system/legacy";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();

  const handleCapture = useCallback(async () => {
    if (!cameraRef.current || isCapturing) return;

    setIsCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      if (!photo?.uri) return;

      const base64 = await readAsStringAsync(photo.uri, {
        encoding: EncodingType.Base64,
      });

      router.replace({
        pathname: "/food-scan-result",
        params: { base64Image: base64 },
      });
    } catch (err) {
      console.error("[CameraScreen] capture error:", err);
      setIsCapturing(false);
    }
  }, [isCapturing, router]);

  // Permission not yet determined
  if (!permission) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Permission denied
  if (!permission.granted) {
    return (
      <View className="flex-1 items-center justify-center bg-background px-8 gap-4">
        <Text className="text-2xl text-center font-semibold text-foreground">
          Camera Access Needed
        </Text>
        <Text className="text-center text-default-500">
          We need camera access to scan your food and calculate calories.
        </Text>
        <Pressable
          onPress={requestPermission}
          className="bg-primary px-8 py-3 rounded-xl"
        >
          <Text className="text-white font-semibold">Allow Camera</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <CameraView ref={cameraRef} className="flex-1" facing="back" />

      {/* Overlay controls */}
      <View className="absolute bottom-0 left-0 right-0 pb-12 items-center gap-4">
        {/* Close button */}
        <Pressable
          onPress={() => router.back()}
          className="absolute left-8 bottom-14"
        >
          <Text className="text-white text-base font-medium">Cancel</Text>
        </Pressable>

        {/* Capture button */}
        <Pressable onPress={handleCapture} disabled={isCapturing}>
          <View className="w-20 h-20 rounded-full border-4 border-white items-center justify-center">
            {isCapturing ? (
              <ActivityIndicator color="white" />
            ) : (
              <View className="w-14 h-14 rounded-full bg-white" />
            )}
          </View>
        </Pressable>

        <Text className="text-white/60 text-sm">
          Point at your food and tap to capture
        </Text>
      </View>
    </View>
  );
}
