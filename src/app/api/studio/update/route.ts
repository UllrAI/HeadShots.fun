import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const PUT = auth(async (req) => {
  if (!req.auth || !req.auth.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { id, name, type, images } = await req.json();

    if (!id || !name || !type || !images || images.length === 0) {
      return new Response("Missing required fields", { status: 400 });
    }

    const studio = await prisma.studio.update({
      where: { id, userId: req.auth.user.id },
      data: { name, type, images },
    });

    return Response.json(studio);
  } catch (error) {
    console.error("Error updating studio:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
