import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useCallback, memo } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useFoodScan, FoodScanResult } from "@/hooks/useFoodScan";
import { FoodNutrition } from "@/server/usdaService";

// ─── Macro badge ────────────────────────────────────────────────────────────
type MacroBadgeProps = {
  label: string;
  value: number;
  unit: string;
  color: string;
};

const MacroBadge = memo(({ label, value, unit, color }: MacroBadgeProps) => (
  <View className="flex-1 items-center gap-1 bg-default-100 rounded-2xl py-3 px-2">
    <Text className={`text-xl font-bold ${color}`}>
      {value}
      <Text className="text-xs font-normal text-default-400">{unit}</Text>
    </Text>
    <Text className="text-xs text-default-500">{label}</Text>
  </View>
));
MacroBadge.displayName = "MacroBadge";

// ─── Food row ────────────────────────────────────────────────────────────────
type FoodRowProps = { item: FoodNutrition };

const FoodRow = memo(({ item }: FoodRowProps) => (
  <View className="flex-row items-center justify-between py-3 border-b border-default-100">
    <View className="flex-1">
      <Text className="text-sm font-medium text-foreground capitalize">
        {item.name}
      </Text>
      <Text className="text-xs text-default-400">{item.estimatedGrams}g</Text>
    </View>
    <View className="flex-row gap-3">
      <Text className="text-sm font-semibold text-foreground">
        {item.calories} kcal
      </Text>
    </View>
  </View>
));
FoodRow.displayName = "FoodRow";

// ─── Summary card ────────────────────────────────────────────────────────────
type SummaryCardProps = { result: FoodScanResult };

const SummaryCard = memo(({ result }: SummaryCardProps) => (
  <View className="bg-primary/10 rounded-3xl p-5 mb-4">
    <Text className="text-center text-4xl font-bold text-primary mb-1">
      {result.totalCalories}
    </Text>
    <Text className="text-center text-sm text-default-500 mb-4">
      Total Calories (kcal)
    </Text>

    <View className="flex-row gap-2">
      <MacroBadge
        label="Protein"
        value={result.totalProtein}
        unit="g"
        color="text-blue-500"
      />
      <MacroBadge
        label="Carbs"
        value={result.totalCarbs}
        unit="g"
        color="text-orange-500"
      />
      <MacroBadge
        label="Fat"
        value={result.totalFat}
        unit="g"
        color="text-rose-500"
      />
    </View>
  </View>
));
SummaryCard.displayName = "SummaryCard";

// ─── Main screen ─────────────────────────────────────────────────────────────
export default function FoodScanResultScreen() {
  const { base64Image } = useLocalSearchParams<{ base64Image: string }>();
  const router = useRouter();
  const { result, isLoading, error, scanFood, reset } = useFoodScan();

  useEffect(() => {
    if (base64Image) {
      scanFood(base64Image);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBack = useCallback(() => {
    reset();
    router.back();
  }, [reset, router]);

  const handleRetry = useCallback(() => {
    if (base64Image) scanFood(base64Image);
  }, [base64Image, scanFood]);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View className="flex-row items-center px-5 pt-14 pb-4">
        <Pressable onPress={handleBack} className="mr-4">
          <Text className="text-primary font-medium text-base">← Back</Text>
        </Pressable>
        <Text className="text-lg font-semibold text-foreground">
          Scan Result
        </Text>
      </View>

      {/* Loading */}
      {isLoading && (
        <View className="flex-1 items-center justify-center gap-4">
          <ActivityIndicator size="large" />
          <Text className="text-default-500 text-sm text-center px-8">
            Identifying food and calculating nutrition…
          </Text>
        </View>
      )}

      {/* Error */}
      {!isLoading && error && (
        <View className="flex-1 items-center justify-center px-8 gap-4">
          <Text className="text-4xl">😕</Text>
          <Text className="text-base text-center font-semibold text-foreground">
            {error}
          </Text>
          <Pressable
            onPress={handleRetry}
            className="bg-primary px-8 py-3 rounded-xl"
          >
            <Text className="text-white font-semibold">Try Again</Text>
          </Pressable>
        </View>
      )}

      {/* Result */}
      {!isLoading && result && (
        <ScrollView
          className="flex-1"
          contentContainerClassName="px-5 pb-10"
          showsVerticalScrollIndicator={false}
        >
          <SummaryCard result={result} />

          <Text className="text-sm font-semibold text-default-600 mb-2 mt-2">
            Detected Items ({result.items.length})
          </Text>

          {result.items.map((item, index) => (
            <FoodRow key={`${item.name}-${index}`} item={item} />
          ))}
        </ScrollView>
      )}
    </View>
  );
}
