export type HealthStatus =
  | 'underweight'
  | 'normal'
  | 'overweight'
  | 'obese'
  | 'severely_obese';

export function calculateBmi(heightCm: number, weightKg: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weightKg / (heightM * heightM)).toFixed(2));
}

export function getHealthStatus(bmi: number): HealthStatus {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  if (bmi < 35) return 'obese';
  return 'severely_obese';
}
