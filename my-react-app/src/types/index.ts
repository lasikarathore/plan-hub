export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
}

export interface UserProfile {
  userId: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number; // in cm
  currentWeight?: number; // in kg
  targetWeight?: number;
  fitnessGoal?: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'endurance';
  activityLevel?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extremely_active';
}

export interface Exercise {
  id: string;
  name: string;
  description: string;
  category: 'strength' | 'cardio' | 'flexibility' | 'balance' | 'sports';
  muscleGroup: string[];
  equipment: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  videoUrl?: string;
  imageUrl?: string;
  instructions: string[];
}

export interface WorkoutExercise {
  id: string;
  exerciseId: string;
  exercise?: Exercise;
  sets: number;
  reps: number;
  weight?: number;
  duration?: number; // in seconds
  restTime: number; // in seconds
  notes?: string;
  completed?: boolean;
}

export interface Workout {
  id: string;
  userId: string;
  name: string;
  date: Date;
  duration: number; // in minutes
  caloriesBurned?: number;
  exercises: WorkoutExercise[];
  notes?: string;
  completed: boolean;
  createdAt: Date;
}

export interface NutritionLog {
  id: string;
  userId: string;
  date: Date;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fats: number; // in grams
  servingSize?: string;
  notes?: string;
}

export interface BodyMeasurement {
  id: string;
  userId: string;
  date: Date;
  weight: number;
  bodyFat?: number; // percentage
  chest?: number; // in cm
  waist?: number;
  hips?: number;
  arms?: number;
  thighs?: number;
  notes?: string;
}

export interface Goal {
  id: string;
  userId: string;
  type: 'weight' | 'workout_frequency' | 'calories' | 'custom';
  title: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  startDate: Date;
  targetDate: Date;
  status: 'active' | 'completed' | 'paused';
  progress: number; // percentage
}

export interface DashboardStats {
  totalWorkouts: number;
  totalCaloriesBurned: number;
  workoutStreak: number;
  weeklyWorkouts: number;
  averageWorkoutDuration: number;
  currentWeight?: number;
  weightChange?: number;
}

export interface ActivityLog {
  id: string;
  type: 'workout' | 'nutrition' | 'measurement' | 'goal';
  title: string;
  description: string;
  timestamp: Date;
  icon: string;
}
