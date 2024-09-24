'use server';

import { prisma } from "@/lib/db";

export async function getStudios(page: number = 1, pageSize: number = 10) {
  const skip = (page - 1) * pageSize;

  const [studios, totalCount] = await Promise.all([
    prisma.studio.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        predictions: {
          select: {
            id: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip,
      take: pageSize,
    }),
    prisma.studio.count(),
  ]);

  return {
    studios: studios.map(studio => ({
      ...studio,
      predictionsCount: studio.predictions.length,
    })),
    totalPages: Math.ceil(totalCount / pageSize),
  };
}

export async function getPredictions(studioId: string) {
  return await prisma.prediction.findMany({
    where: {
      studioId: studioId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
}