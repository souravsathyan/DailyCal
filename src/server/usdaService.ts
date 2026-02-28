const USDA_API_KEY = process.env.EXPO_PUBLIC_USDA_API_KEY ?? '';
const BASE_URL = 'https://api.nal.usda.gov/fdc/v1';

export type FoodNutrition = {
  name: string;
  estimatedGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

type UsdaNutrient = {
  nutrientName: string;
  value: number;
};

type UsdaFood = {
  description: string;
  foodNutrients: UsdaNutrient[];
};

type UsdaSearchResponse = {
  foods: UsdaFood[];
};

const getNutrientValue = (nutrients: UsdaNutrient[], name: string): number => {
  const found = nutrients.find((n) =>
    n.nutrientName.toLowerCase().includes(name.toLowerCase())
  );
  return found?.value ?? 0;
};

// Scales a per-100g value to the actual estimated grams
const scale = (per100g: number, grams: number): number =>
  parseFloat(((per100g * grams) / 100).toFixed(1));

export const fetchNutritionForFood = async (
  name: string,
  estimatedGrams: number
): Promise<FoodNutrition> => {
  const url = `${BASE_URL}/foods/search?query=${encodeURIComponent(name)}&pageSize=1&api_key=${USDA_API_KEY}`;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`USDA API error: ${response.status}`);
  }

  const data: UsdaSearchResponse = await response.json();
  const food = data.foods?.[0];

  if (!food) {
    // Return zeros if food not found rather than failing the whole scan
    return { name, estimatedGrams, calories: 0, protein: 0, carbs: 0, fat: 0 };
  }

  const nutrients = food.foodNutrients;

  return {
    name,
    estimatedGrams,
    calories: scale(getNutrientValue(nutrients, 'Energy'), estimatedGrams),
    protein: scale(getNutrientValue(nutrients, 'Protein'), estimatedGrams),
    carbs: scale(getNutrientValue(nutrients, 'Carbohydrate'), estimatedGrams),
    fat: scale(getNutrientValue(nutrients, 'Total lipid'), estimatedGrams),
  };
};
