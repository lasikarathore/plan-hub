import { Response } from 'express';
import { z } from 'zod';
import prisma from '../utils/prisma';
import { AuthRequest } from '../middleware/auth.middleware';

const createMeasurementSchema = z.object({
  date: z.string().optional(),
  weight: z.number().min(0, 'Weight must be positive'),
  bodyFat: z.number().min(0).max(100).optional(),
  chest: z.number().min(0).optional(),
  waist: z.number().min(0).optional(),
  hips: z.number().min(0).optional(),
  arms: z.number().min(0).optional(),
  thighs: z.number().min(0).optional(),
  notes: z.string().optional(),
});

const updateMeasurementSchema = z.object({
  date: z.string().optional(),
  weight: z.number().min(0).optional(),
  bodyFat: z.number().min(0).max(100).optional(),
  chest: z.number().min(0).optional(),
  waist: z.number().min(0).optional(),
  hips: z.number().min(0).optional(),
  arms: z.number().min(0).optional(),
  thighs: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export const getMeasurements = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { startDate, endDate, limit } = req.query;

    const where: any = { userId };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate as string);
      if (endDate) where.date.lte = new Date(endDate as string);
    }

    const measurements = await prisma.bodyMeasurement.findMany({
      where,
      orderBy: {
        date: 'desc',
      },
      take: limit ? parseInt(limit as string) : undefined,
    });

    res.json(measurements);
  } catch (error) {
    console.error('Get measurements error:', error);
    res.status(500).json({ error: 'Failed to fetch measurements' });
  }
};

export const getLatestMeasurement = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const measurement = await prisma.bodyMeasurement.findFirst({
      where: { userId },
      orderBy: {
        date: 'desc',
      },
    });

    if (!measurement) {
      res.status(404).json({ error: 'No measurements found' });
      return;
    }

    res.json(measurement);
  } catch (error) {
    console.error('Get latest measurement error:', error);
    res.status(500).json({ error: 'Failed to fetch latest measurement' });
  }
};

export const getProgressAnalysis = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days as string));

    const measurements = await prisma.bodyMeasurement.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
        },
      },
      orderBy: {
        date: 'asc',
      },
    });

    if (measurements.length < 2) {
      res.json({
        message: 'Not enough data for analysis',
        measurements: measurements.length,
      });
      return;
    }

    const first = measurements[0];
    const latest = measurements[measurements.length - 1];

    const analysis = {
      period: {
        start: first.date,
        end: latest.date,
        days: Math.floor(
          (latest.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24)
        ),
      },
      weightChange: {
        start: first.weight,
        current: latest.weight,
        change: latest.weight - first.weight,
        percentChange: ((latest.weight - first.weight) / first.weight) * 100,
      },
      bodyFatChange: first.bodyFat && latest.bodyFat
        ? {
            start: first.bodyFat,
            current: latest.bodyFat,
            change: latest.bodyFat - first.bodyFat,
          }
        : null,
      measurements: measurements.length,
      dataPoints: measurements,
    };

    res.json(analysis);
  } catch (error) {
    console.error('Get progress analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze progress' });
  }
};

export const createMeasurement = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const validatedData = createMeasurementSchema.parse(req.body);

    const measurement = await prisma.bodyMeasurement.create({
      data: {
        userId,
        date: validatedData.date ? new Date(validatedData.date) : new Date(),
        weight: validatedData.weight,
        bodyFat: validatedData.bodyFat,
        chest: validatedData.chest,
        waist: validatedData.waist,
        hips: validatedData.hips,
        arms: validatedData.arms,
        thighs: validatedData.thighs,
        notes: validatedData.notes,
      },
    });

    res.status(201).json(measurement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Create measurement error:', error);
    res.status(500).json({ error: 'Failed to create measurement' });
  }
};

export const updateMeasurement = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;
    const validatedData = updateMeasurementSchema.parse(req.body);

    const existingMeasurement = await prisma.bodyMeasurement.findFirst({
      where: { id, userId },
    });

    if (!existingMeasurement) {
      res.status(404).json({ error: 'Measurement not found' });
      return;
    }

    const measurement = await prisma.bodyMeasurement.update({
      where: { id },
      data: {
        date: validatedData.date ? new Date(validatedData.date) : undefined,
        weight: validatedData.weight,
        bodyFat: validatedData.bodyFat,
        chest: validatedData.chest,
        waist: validatedData.waist,
        hips: validatedData.hips,
        arms: validatedData.arms,
        thighs: validatedData.thighs,
        notes: validatedData.notes,
      },
    });

    res.json(measurement);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation failed', details: error.errors });
      return;
    }
    console.error('Update measurement error:', error);
    res.status(500).json({ error: 'Failed to update measurement' });
  }
};

export const deleteMeasurement = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { id } = req.params;

    const measurement = await prisma.bodyMeasurement.findFirst({
      where: { id, userId },
    });

    if (!measurement) {
      res.status(404).json({ error: 'Measurement not found' });
      return;
    }

    await prisma.bodyMeasurement.delete({
      where: { id },
    });

    res.json({ message: 'Measurement deleted successfully' });
  } catch (error) {
    console.error('Delete measurement error:', error);
    res.status(500).json({ error: 'Failed to delete measurement' });
  }
};
