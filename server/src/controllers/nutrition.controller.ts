import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const createNutritionSchema = z.object({
  date: z.string().optional(),
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack']),
  foodName: z.string().min(1, 'Food name is required'),
  calories: z.number().min(0, 'Calories must be positive'),
  protein: z.number().min(0, 'Protein must be positive'),
  carbs: z.number().min(0, 'Carbs must be positive'),
  fats: z.number().min(0, 'Fats must be positive'),
});

const updateNutritionSchema = z.object({
  date: z.string().optional(),
  mealType: z.enum(['Breakfast', 'Lunch', 'Dinner', 'Snack']).optional(),
  foodName: z.string().optional(),
  calories: z.number().min(0).optional(),
  protein: z.number().min(0).optional(),
  carbs: z.number().min(0).optional(),
  fats: z.number().min(0).optional(),
});

export const getNutritionLogs = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { startDate, endDate, mealType } = req.query;

    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    if (mealType) {
      where.mealType = mealType;
    }

    const logs = await prisma.nutritionLog.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
    });

    res.json(logs);
  } catch (error) {
    console.error('Get nutrition logs error:', error);
    res.status(500).json({ error: 'Failed to fetch nutrition logs' });
  }
};

export const getDailyTotals = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { date } = req.query;

    const targetDate = date ? new Date(date as string) : new Date();
    const startOfDay = new Date(targetDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(targetDate.setHours(23, 59, 59, 999));

    const logs = await prisma.nutritionLog.findMany({
      where: {
        userId,
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    const totals = logs.reduce(
      (acc, log) => ({
        calories: acc.calories + log.calories,
        protein: acc.protein + log.protein,
        carbs: acc.carbs + log.carbs,
        fats: acc.fats + log.fats,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );

    res.json({
      date: targetDate,
      totals,
      meals: logs.length,
    });
  } catch (error) {
    console.error('Get daily totals error:', error);
    res.status(500).json({ error: 'Failed to calculate daily totals' });
  }
};

export const createNutritionLog = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const validatedData = createNutritionSchema.parse(req.body);

    const log = await prisma.nutritionLog.create({
      data: {
        userId,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        mealType: validatedData.mealType,
        foodName: validatedData.foodName,
        calories: validatedData.calories,
        protein: validatedData.protein,
        carbs: validatedData.carbs,
        fats: validatedData.fats,
      },
    });

    res.status(201).json(log);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create nutrition log error:', error);
    res.status(500).json({ error: 'Failed to create nutrition log' });
  }
};

export const updateNutritionLog = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const validatedData = updateNutritionSchema.parse(req.body);

    const existingLog = await prisma.nutritionLog.findFirst({
      where: { id, userId },
    });

    if (!existingLog) {
      res.status(404).json({ error: 'Nutrition log not found' });
      return;
    }

    const log = await prisma.nutritionLog.update({
      where: { id },
      data: {
        date: validatedData.date ? new Date(validatedData.date) : undefined,
        mealType: validatedData.mealType,
        foodName: validatedData.foodName,
        calories: validatedData.calories,
        protein: validatedData.protein,
        carbs: validatedData.carbs,
        fats: validatedData.fats,
      },
    });

    res.json(log);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Update nutrition log error:', error);
    res.status(500).json({ error: 'Failed to update nutrition log' });
  }
};

export const deleteNutritionLog = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const log = await prisma.nutritionLog.findFirst({
      where: { id, userId },
    });

    if (!log) {
      res.status(404).json({ error: 'Nutrition log not found' });
      return;
    }

    await prisma.nutritionLog.delete({
      where: { id },
    });

    res.json({ message: 'Nutrition log deleted successfully' });
  } catch (error) {
    console.error('Delete nutrition log error:', error);
    res.status(500).json({ error: 'Failed to delete nutrition log' });
  }
};
