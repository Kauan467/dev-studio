import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Você precisa estar logado" },
        { status: 401 }
      );
    }

    const languages = await prisma.snippet.groupBy({
      by: ["language"],
      where: { userId: session.user.id },
      _count: { language: true },
      orderBy: { _count: { language: "desc" } },
    });

    return NextResponse.json(languages);
  } catch (error) {
    console.error("Erro ao buscar linguagens:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
