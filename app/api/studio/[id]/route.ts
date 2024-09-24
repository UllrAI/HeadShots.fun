import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const GET = auth(async (req, { params }: { params: { id: string } }) => {
  if (!req.auth || !req.auth.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { id } = params;

    if (!id) {
      return new Response("Missing studio id", { status: 400 });
    }

    const studio = await prisma.studio.findUnique({
      where: { id, userId: req.auth.user.id },
      include: {
        predictions: {
          select: {
            id: true,
            createdAt: true,
            imageUrl: true,
            status: true,
            style: true,
            pId: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!studio) {
      return new Response("Studio not found or not owned by user", { status: 404 });
    }

    return new Response(JSON.stringify(studio), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error fetching studio:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});

export const PATCH = auth(async (req, { params }: { params: { id: string } }) => {
  if (!req.auth || !req.auth.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { id } = params;
    const { name, type } = await req.json();

    if (!id) {
      return new Response("Missing studio id", { status: 400 });
    }

    const studio = await prisma.studio.update({
      where: { id, userId: req.auth.user.id },
      data: { name, type },
    });

    if (!studio) {
      return new Response("Studio not found or not owned by user", { status: 404 });
    }

    return new Response(JSON.stringify(studio), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("Error updating studio:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});