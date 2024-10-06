'use server';

import { prisma } from "@/lib/db";

export async function getPredictions(page: number = 1, pageSize: number = 10, status: string | null = null) {
  const skip = (page - 1) * pageSize;

  const where = status ? { status } : {};

  const [predictions, totalCount] = await Promise.all([
    prisma.prediction.findMany({
      where,
      include: {
        studio: {
          select: {
            name: true,
            user: {
              select: {
                email: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
    }),
    prisma.prediction.count({ where }),
  ]);

  return {
    predictions: predictions.map(prediction => ({
      ...prediction,
      userEmail: prediction.studio?.user?.email || 'N/A',
    })),
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function deletePrediction(id: string) {
  try {
    await prisma.prediction.delete({
      where: { id },
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting prediction:', error);
    return { success: false, error: 'Failed to delete prediction' };
  }
}