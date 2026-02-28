import { supabase } from './supabase';
import { calculateBmi, getHealthStatus } from '@/utils/bmi';

interface SaveProfileParams {
  userId: string;
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'low' | 'medium' | 'high';
}

export const ProfileService = {
  saveProfile: async (params: SaveProfileParams) => {
    const bmi = calculateBmi(params.height, params.weight);
    const healthStatus = getHealthStatus(bmi);

    // 1. Save profile data
    const { error: profileError } = await supabase.from('user_profiles').upsert({
      id: params.userId,
      height_cm: params.height,
      weight_kg: params.weight,
      age: params.age,
      gender: params.gender,
      activity_level: params.activityLevel,
      bmi,
      health_status: healthStatus,
    });

    if (profileError) throw profileError;

    // 2. Mark onboarding as complete
    const { error: userError } = await supabase
      .from('users')
      .update({ is_onboarded: true })
      .eq('id', params.userId);

    if (userError) throw userError;
  },

  fetchIsOnboarded: async (userId: string): Promise<boolean> => {
    const { data, error } = await supabase
      .from('users')
      .select('is_onboarded')
      .eq('id', userId)
      .maybeSingle(); // handles missing row gracefully (returns null instead of throwing)

    if (error) throw error;
    return data?.is_onboarded ?? false;
  },
};
