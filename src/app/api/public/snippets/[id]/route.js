import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const snippet = await prisma.snippet.findUnique({
      where: { id },
      include: {
        tags: { include: { tag: true } },
        user: { select: { name: true } },
      },
    });

    if (!snippet) {
      return NextResponse.json({ error: "Snippet não encontrado" }, { status: 404 });
    }

    if (!snippet.isPublic) {
      return NextResponse.json({ error: "Este snippet não é público" }, { status: 403 });
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error("Erro ao buscar snippet público:", error);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}
