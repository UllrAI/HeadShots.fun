import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export const POST = auth(async (req) => {
  if (!req.auth || !req.auth.user) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const { id } = await req.json();

    if (!id) {
      return new Response("Missing studio id", { status: 400 });
    }

    const studio = await prisma.studio.findUnique({
      where: { id, userId: req.auth.user.id },
    });

    if (!studio) {
      return new Response("Studio not found or not owned by user", { status: 404 });
    }

    await prisma.studio.delete({
      where: { id },
    });

    return new Response("Studio deleted successfully", { status: 200 });
  } catch (error) {
    console.error("Error deleting studio:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
});
