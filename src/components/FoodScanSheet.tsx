import BottomSheet, {
  BottomSheetView,
  BottomSheetBackdrop,
} from "@gorhom/bottom-sheet";
import { useCallback, useMemo, forwardRef } from "react";
import { View, Text, Pressable } from "react-native";

type FoodScanSheetProps = {
  onCamera: () => void;
  onGallery: () => void;
};

const FoodScanSheet = forwardRef<BottomSheet, FoodScanSheetProps>(
  ({ onCamera, onGallery }, ref) => {
    const snapPoints = useMemo(() => ["28%"], []);

    const renderBackdrop = useCallback(
      (props: any) => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={-1}
          appearsOnIndex={0}
        />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView className="flex-1 px-6 pt-2 pb-6">
          <Text className="text-center text-base font-semibold text-foreground mb-6">
            Add Food
          </Text>

          <View className="flex-row justify-center gap-10">
            {/* Camera Option */}
            <Pressable onPress={onCamera} className="items-center gap-2">
              <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center">
                <Text className="text-3xl">📷</Text>
              </View>
              <Text className="text-sm text-foreground font-medium">
                Camera
              </Text>
            </Pressable>

            {/* Gallery Option */}
            <Pressable onPress={onGallery} className="items-center gap-2">
              <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center">
                <Text className="text-3xl">🖼️</Text>
              </View>
              <Text className="text-sm text-foreground font-medium">
                Gallery
              </Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

FoodScanSheet.displayName = "FoodScanSheet";

export default FoodScanSheet;
