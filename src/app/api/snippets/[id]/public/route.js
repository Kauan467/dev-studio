import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/getSession";

export async function PATCH(request, { params }) {
  try {
    const { error, session } = await requireAuth();

    if (error) {
      return NextResponse.json({ error: "Você precisa estar logado" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await prisma.snippet.findUnique({ where: { id } });

    if (!existing) {
      return NextResponse.json({ error: "Snippet não encontrado" }, { status: 404 });
    }

    if (existing.userId !== session.user.id) {
      return NextResponse.json({ error: "Sem permissão" }, { status: 403 });
    }

    const updated = await prisma.snippet.update({
      where: { id },
      data: { isPublic: !existing.isPublic },
    });

    return NextResponse.json({ isPublic: updated.isPublic });
  } catch (error) {
    console.error("Erro ao alterar visibilidade:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}