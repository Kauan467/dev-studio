import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
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
        userId: "4e33098b-62dd-4fa6-b618-1e82ff1342f6",
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
    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search");
    const language = searchParams.get("language");
    const tag = searchParams.get("tag");

    const where = {};

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
