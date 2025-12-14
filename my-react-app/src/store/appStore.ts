import { create } from 'zustand';
import type { Workout, Exercise, NutritionLog, BodyMeasurement, Goal } from '../types';

interface AppState {
  workouts: Workout[];
  exercises: Exercise[];
  nutritionLogs: NutritionLog[];
  measurements: BodyMeasurement[];
  goals: Goal[];
  
  // Workouts
  addWorkout: (workout: Workout) => void;
  updateWorkout: (id: string, workout: Partial<Workout>) => void;
  deleteWorkout: (id: string) => void;
  
  // Exercises
  setExercises: (exercises: Exercise[]) => void;
  
  // Nutrition
  addNutritionLog: (log: NutritionLog) => void;
  updateNutritionLog: (id: string, log: Partial<NutritionLog>) => void;
  deleteNutritionLog: (id: string) => void;
  
  // Measurements
  addMeasurement: (measurement: BodyMeasurement) => void;
  
  // Goals
  addGoal: (goal: Goal) => void;
  updateGoal: (id: string, goal: Partial<Goal>) => void;
  deleteGoal: (id: string) => void;
}

export const useAppStore = create<AppState>((set) => ({
  workouts: [],
  exercises: [],
  nutritionLogs: [],
  measurements: [],
  goals: [],

  // Workouts
  addWorkout: (workout) => 
    set((state) => ({ workouts: [...state.workouts, workout] })),
  
  updateWorkout: (id, workoutUpdate) =>
    set((state) => ({
      workouts: state.workouts.map((w) =>
        w.id === id ? { ...w, ...workoutUpdate } : w
      ),
    })),
  
  deleteWorkout: (id) =>
    set((state) => ({
      workouts: state.workouts.filter((w) => w.id !== id),
    })),

  // Exercises
  setExercises: (exercises) => set({ exercises }),

  // Nutrition
  addNutritionLog: (log) =>
    set((state) => ({ nutritionLogs: [...state.nutritionLogs, log] })),
  
  updateNutritionLog: (id, logUpdate) =>
    set((state) => ({
      nutritionLogs: state.nutritionLogs.map((log) =>
        log.id === id ? { ...log, ...logUpdate } : log
      ),
    })),
  
  deleteNutritionLog: (id) =>
    set((state) => ({
      nutritionLogs: state.nutritionLogs.filter((log) => log.id !== id),
    })),

  // Measurements
  addMeasurement: (measurement) =>
    set((state) => ({ measurements: [...state.measurements, measurement] })),

  // Goals
  addGoal: (goal) =>
    set((state) => ({ goals: [...state.goals, goal] })),
  
  updateGoal: (id, goalUpdate) =>
    set((state) => ({
      goals: state.goals.map((g) =>
        g.id === id ? { ...g, ...goalUpdate } : g
      ),
    })),
  
  deleteGoal: (id) =>
    set((state) => ({
      goals: state.goals.filter((g) => g.id !== id),
    })),
}));
