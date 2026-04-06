import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/getSession";

export async function POST(request) {
  try {
    const { error, session } = await requireAuth();

    if (error) {
      return NextResponse.json(
        { error: "Você precisa estar logado para criar snippets" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const { title, description, code, language, tags } = body;

    if (!title || !code || !language) {
      return NextResponse.json(
        { error: "Título, código e linguagem são obrigatórios" },
        { status: 400 }
      );
    }

    const snippet = await prisma.snippet.create({
      data: {
        title,
        description: description || null,
        code,
        language: language.toLowerCase(),
        userId: session.user.id,
        tags: {
          create: tags
            ? tags.map((tagName) => ({
                tag: {
                  connectOrCreate: {
                    where: { name: tagName.toLowerCase() },
                    create: { name: tagName.toLowerCase() },
                  },
                },
              }))
            : [],
        },
      },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    return NextResponse.json(snippet, { status: 201 });
  } catch (error) {
    console.error("Erro ao criar snippet:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { error, session } = await requireAuth();

    if (error) {
      return NextResponse.json(
        { error: "Você precisa estar logado" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const language = searchParams.get("language");
    const tag = searchParams.get("tag");

    const where = {
      userId: session.user.id,
    };

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    if (language) {
      where.language = language.toLowerCase();
    }

    if (tag) {
      where.tags = {
        some: {
          tag: {
            name: tag.toLowerCase(),
          },
        },
      };
    }

    const snippets = await prisma.snippet.findMany({
      where,
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(snippets);
  } catch (error) {
    console.error("Erro ao listar snippets:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
