import { format, formatDistance, isToday, isYesterday, parseISO } from 'date-fns';

export const formatDate = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  
  if (isToday(parsedDate)) {
    return 'Today';
  }
  if (isYesterday(parsedDate)) {
    return 'Yesterday';
  }
  return format(parsedDate, 'MMM dd, yyyy');
};

export const formatTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return format(parsedDate, 'hh:mm a');
};

export const formatRelativeTime = (date: Date | string): string => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;
  return formatDistance(parsedDate, new Date(), { addSuffix: true });
};

export const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  }
  return `${secs}s`;
};

export const calculateBMI = (weight: number, height: number): number => {
  // weight in kg, height in cm
  const heightInMeters = height / 100;
  return Number((weight / (heightInMeters * heightInMeters)).toFixed(1));
};

export const getBMICategory = (bmi: number): string => {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
};

export const calculateCalorieGoal = (
  weight: number,
  height: number,
  age: number,
  gender: 'male' | 'female',
  activityLevel: string,
  goal: string
): number => {
  // Mifflin-St Jeor Equation for BMR
  let bmr: number;
  if (gender === 'male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity multiplier
  const activityMultipliers: Record<string, number> = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725,
    extremely_active: 1.9
  };

  let tdee = bmr * (activityMultipliers[activityLevel] || 1.2);

  // Adjust based on goal
  if (goal === 'weight_loss') {
    tdee -= 500; // 500 calorie deficit
  } else if (goal === 'muscle_gain') {
    tdee += 300; // 300 calorie surplus
  }

  return Math.round(tdee);
};

export const calculateMacros = (calories: number, goal: string) => {
  let proteinPercentage = 0.3;
  let carbsPercentage = 0.4;
  let fatsPercentage = 0.3;

  if (goal === 'muscle_gain') {
    proteinPercentage = 0.35;
    carbsPercentage = 0.45;
    fatsPercentage = 0.2;
  } else if (goal === 'weight_loss') {
    proteinPercentage = 0.35;
    carbsPercentage = 0.3;
    fatsPercentage = 0.35;
  }

  return {
    protein: Math.round((calories * proteinPercentage) / 4), // 4 calories per gram
    carbs: Math.round((calories * carbsPercentage) / 4),
    fats: Math.round((calories * fatsPercentage) / 9) // 9 calories per gram
  };
};

export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num);
};

export const clamp = (value: number, min: number, max: number): number => {
  return Math.min(Math.max(value, min), max);
};

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const slugify = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim();
};
