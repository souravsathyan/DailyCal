import { create } from 'zustand';

interface OnboardingState {
  height: number | null;
  weight: number | null;
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  activityLevel: 'low' | 'medium' | 'high' | null;
  setHeight: (height: number) => void;
  setWeight: (weight: number) => void;
  setAge: (age: number) => void;
  setGender: (gender: 'male' | 'female' | 'other') => void;
  setActivityLevel: (level: 'low' | 'medium' | 'high') => void;
  reset: () => void;
}

export const useOnboardingStore = create<OnboardingState>((set) => ({
  height: null,
  weight: null,
  age: null,
  gender: null,
  activityLevel: null,
  setHeight: (height) => set({ height }),
  setWeight: (weight) => set({ weight }),
  setAge: (age) => set({ age }),
  setGender: (gender) => set({ gender }),
  setActivityLevel: (activityLevel) => set({ activityLevel }),
  reset: () =>
    set({
      height: null,
      weight: null,
      age: null,
      gender: null,
      activityLevel: null,
    }),
}));
