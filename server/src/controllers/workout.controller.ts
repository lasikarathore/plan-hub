import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const exerciseSchema = z.object({
  name: z.string().min(1, 'Exercise name is required'),
  sets: z.number().min(1, 'Sets must be at least 1'),
  reps: z.number().min(1, 'Reps must be at least 1'),
  weight: z.number().optional(),
  notes: z.string().optional(),
});

const createWorkoutSchema = z.object({
  name: z.string().min(1, 'Workout name is required'),
  description: z.string().optional(),
  date: z.string().optional(),
  duration: z.number().optional(),
  exercises: z.array(exerciseSchema).min(1, 'At least one exercise is required'),
});

const updateWorkoutSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  date: z.string().optional(),
  duration: z.number().optional(),
  exercises: z.array(exerciseSchema).optional(),
});

export const getWorkouts = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { startDate, endDate } = req.query;

    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const workouts = await prisma.workout.findMany({
      where,
      include: {
        exercises: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(workouts);
  } catch (error) {
    console.error('Get workouts error:', error);
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
};

export const getWorkoutById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const workout = await prisma.workout.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        exercises: true,
      },
    });

    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    res.json(workout);
  } catch (error) {
    console.error('Get workout error:', error);
    res.status(500).json({ error: 'Failed to fetch workout' });
  }
};

export const createWorkout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const validatedData = createWorkoutSchema.parse(req.body);

    const workout = await prisma.workout.create({
      data: {
        userId,
        name: validatedData.name,
        description: validatedData.description,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        duration: validatedData.duration,
        exercises: {
          create: validatedData.exercises,
        },
      },
      include: {
        exercises: true,
      },
    });

    res.status(201).json(workout);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create workout error:', error);
    res.status(500).json({ error: 'Failed to create workout' });
  }
};

export const updateWorkout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const validatedData = updateWorkoutSchema.parse(req.body);

    const existingWorkout = await prisma.workout.findFirst({
      where: { id, userId },
    });

    if (!existingWorkout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    if (validatedData.exercises) {
      await prisma.exercise.deleteMany({
        where: { workoutId: id },
      });
    }

    const workout = await prisma.workout.update({
      where: { id },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        date: validatedData.date ? new Date(validatedData.date) : undefined,
        duration: validatedData.duration,
        exercises: validatedData.exercises
          ? {
              create: validatedData.exercises,
            }
          : undefined,
      },
      include: {
        exercises: true,
      },
    });

    res.json(workout);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Update workout error:', error);
    res.status(500).json({ error: 'Failed to update workout' });
  }
};

export const deleteWorkout = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const workout = await prisma.workout.findFirst({
      where: { id, userId },
    });

    if (!workout) {
      res.status(404).json({ error: 'Workout not found' });
      return;
    }

    await prisma.workout.delete({
      where: { id },
    });

    res.json({ message: 'Workout deleted successfully' });
  } catch (error) {
    console.error('Delete workout error:', error);
    res.status(500).json({ error: 'Failed to delete workout' });
  }
};
