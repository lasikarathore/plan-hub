import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const updateProfileSchema = z.object({
  name: z.string().min(2).optional(),
  age: z.number().min(1).max(120).optional(),
  gender: z.string().optional(),
  height: z.number().min(0).optional(),
  weight: z.number().min(0).optional(),
});

const createGoalSchema = z.object({
  type: z.enum(['weight_loss', 'muscle_gain', 'maintenance']),
  targetWeight: z.number().min(0).optional(),
  targetDate: z.string().optional(),
  dailyCalories: z.number().min(0).optional(),
  dailyProtein: z.number().min(0).optional(),
  dailyCarbs: z.number().min(0).optional(),
  dailyFats: z.number().min(0).optional(),
  weeklyWorkouts: z.number().min(0).max(14).optional(),
});

const updateGoalSchema = createGoalSchema.partial();

export const getProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Calculate BMI if height and weight are available
    let bmi = null;
    if (user.height && user.weight) {
      const heightInMeters = user.height / 100;
      bmi = user.weight / (heightInMeters * heightInMeters);
      bmi = Math.round(bmi * 10) / 10;
    }

    res.json({
      ...user,
      bmi,
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
};

export const updateProfile = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const validatedData = updateProfileSchema.parse(req.body);

    const user = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        updatedAt: true,
      },
    });

    // Calculate BMI
    let bmi = null;
    if (user.height && user.weight) {
      const heightInMeters = user.height / 100;
      bmi = user.weight / (heightInMeters * heightInMeters);
      bmi = Math.round(bmi * 10) / 10;
    }

    res.json({
      ...user,
      bmi,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

export const getGoals = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { active } = req.query;

    const where: any = { userId };
    if (active !== undefined) {
      where.isActive = active === 'true';
    }

    const goals = await prisma.goal.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json(goals);
  } catch (error) {
    console.error('Get goals error:', error);
    res.status(500).json({ error: 'Failed to fetch goals' });
  }
};

export const getActiveGoal = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const goal = await prisma.goal.findFirst({
      where: {
        userId,
        isActive: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    if (!goal) {
      res.status(404).json({ error: 'No active goal found' });
      return;
    }

    res.json(goal);
  } catch (error) {
    console.error('Get active goal error:', error);
    res.status(500).json({ error: 'Failed to fetch active goal' });
  }
};

export const createGoal = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const validatedData = createGoalSchema.parse(req.body);

    // Deactivate previous goals if this is going to be active
    await prisma.goal.updateMany({
      where: {
        userId,
        isActive: true,
      },
      data: {
        isActive: false,
      },
    });

    const goal = await prisma.goal.create({
      data: {
        userId,
        type: validatedData.type,
        targetWeight: validatedData.targetWeight,
        targetDate: validatedData.targetDate
          ? new Date(validatedData.targetDate)
          : null,
        dailyCalories: validatedData.dailyCalories,
        dailyProtein: validatedData.dailyProtein,
        dailyCarbs: validatedData.dailyCarbs,
        dailyFats: validatedData.dailyFats,
        weeklyWorkouts: validatedData.weeklyWorkouts,
        isActive: true,
      },
    });

    res.status(201).json(goal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create goal error:', error);
    res.status(500).json({ error: 'Failed to create goal' });
  }
};

export const updateGoal = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const validatedData = updateGoalSchema.parse(req.body);

    const existingGoal = await prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!existingGoal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    const goal = await prisma.goal.update({
      where: { id },
      data: {
        type: validatedData.type,
        targetWeight: validatedData.targetWeight,
        targetDate: validatedData.targetDate
          ? new Date(validatedData.targetDate)
          : undefined,
        dailyCalories: validatedData.dailyCalories,
        dailyProtein: validatedData.dailyProtein,
        dailyCarbs: validatedData.dailyCarbs,
        dailyFats: validatedData.dailyFats,
        weeklyWorkouts: validatedData.weeklyWorkouts,
      },
    });

    res.json(goal);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Update goal error:', error);
    res.status(500).json({ error: 'Failed to update goal' });
  }
};

export const deleteGoal = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const goal = await prisma.goal.findFirst({
      where: { id, userId },
    });

    if (!goal) {
      res.status(404).json({ error: 'Goal not found' });
      return;
    }

    await prisma.goal.delete({
      where: { id },
    });

    res.json({ message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Delete goal error:', error);
    res.status(500).json({ error: 'Failed to delete goal' });
  }
};
