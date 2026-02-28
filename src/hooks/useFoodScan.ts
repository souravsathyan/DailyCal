import { useCallback, useState } from 'react';
import { identifyFoodFromImage } from '@/server/geminiService';
import { fetchNutritionForFood, FoodNutrition } from '@/server/usdaService';

export type FoodScanResult = {
  items: FoodNutrition[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
};

type UseFoodScanReturn = {
  result: FoodScanResult | null;
  isLoading: boolean;
  error: string | null;
  scanFood: (base64Image: string) => Promise<void>;
  reset: () => void;
};

export const useFoodScan = (): UseFoodScanReturn => {
  const [result, setResult] = useState<FoodScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setIsLoading(false);
  }, []);

  const scanFood = useCallback(async (base64Image: string) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Step 1: Identify foods via Gemini
      const foodItems = await identifyFoodFromImage(base64Image);

      if (foodItems.length === 0) {
        setError('No food items detected in the image. Please try again.');
        return;
      }

      // Step 2: Fetch nutrition for all foods in parallel
      const nutritionItems = await Promise.all(
        foodItems.map((item) => fetchNutritionForFood(item.name, item.estimatedGrams))
      );

      // Step 3: Aggregate totals
      const totals = nutritionItems.reduce(
        (acc, item) => ({
          totalCalories: acc.totalCalories + item.calories,
          totalProtein: acc.totalProtein + item.protein,
          totalCarbs: acc.totalCarbs + item.carbs,
          totalFat: acc.totalFat + item.fat,
        }),
        { totalCalories: 0, totalProtein: 0, totalCarbs: 0, totalFat: 0 }
      );

      setResult({
        items: nutritionItems,
        totalCalories: parseFloat(totals.totalCalories.toFixed(1)),
        totalProtein: parseFloat(totals.totalProtein.toFixed(1)),
        totalCarbs: parseFloat(totals.totalCarbs.toFixed(1)),
        totalFat: parseFloat(totals.totalFat.toFixed(1)),
      });
    } catch (err) {
      setError('Something went wrong while scanning. Please try again.');
      console.error('[useFoodScan]', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { result, isLoading, error, scanFood, reset };
};
