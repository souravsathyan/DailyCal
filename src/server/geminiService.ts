import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY ?? '';

export type FoodItem = {
  name: string;
  estimatedGrams: number;
};

const PROMPT = `You are a food recognition and nutrition expert.
Analyze this food image and identify all food items visible.
For each food item, estimate the quantity in grams.

Return ONLY a valid JSON array with no markdown, no explanation.
Format:
[{"name": "food name", "estimatedGrams": 100}]

Rules:
- Use lowercase names (e.g. "white rice", "grilled chicken breast")
- estimatedGrams must be a number
- If no food is found, return an empty array []`;

export const identifyFoodFromImage = async (base64Image: string): Promise<FoodItem[]> => {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const imagePart = {
    inlineData: {
      data: base64Image,
      mimeType: 'image/jpeg' as const,
    },
  };

  const result = await model.generateContent([PROMPT, imagePart]);
  const text = result.response.text().trim();

  // Strip markdown code block if Gemini wraps it
  const cleaned = text.replace(/```json|```/g, '').trim();
  const parsed: FoodItem[] = JSON.parse(cleaned);

  return parsed;
};
