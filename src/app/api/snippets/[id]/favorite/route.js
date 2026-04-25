import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/getSession";

export async function PATCH(request, { params }) {
  try {
    const { error, session } = await requireAuth();

    if (error) {
      return NextResponse.json(
        { error: "Você precisa estar logado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const existing = await prisma.snippet.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Snippet não encontrado" },
        { status: 404 }
      );
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json(
        { error: "Você não tem permissão para editar este snippet" },
        { status: 403 }
      );
    }

    const updated = await prisma.snippet.update({
      where: { id },
      data: { isFavorite: !existing.isFavorite },
    });

    return NextResponse.json({ isFavorite: updated.isFavorite });
  } catch (error) {
    console.error("Erro ao favoritar snippet:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
