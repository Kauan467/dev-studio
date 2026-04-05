import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

//  /api/snippets/[id] - buscar um snippet específico
export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const snippet = await prisma.snippet.findUnique({
      where: { id },
      include: {
        tags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!snippet) {
      return NextResponse.json(
        { error: "Snippet não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(snippet);
  } catch (error) {
    console.error("Erro ao buscar snippet:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

//  /api/snippets/[id] - editar um snippet
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { title, description, code, language, tags } = body;

    const existing = await prisma.snippet.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Snippet não encontrado" },
        { status: 404 }
      );
    }

    // remove as tags antigas antes de adicionar as novas
    await prisma.snippetTag.deleteMany({
      where: { snippetId: id },
    });

    const snippet = await prisma.snippet.update({
      where: { id },
      data: {
        title: title || existing.title,
        description: description !== undefined ? description : existing.description,
        code: code || existing.code,
        language: language ? language.toLowerCase() : existing.language,
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

    return NextResponse.json(snippet);
  } catch (error) {
    console.error("Erro ao editar snippet:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}

//  /api/snippets/[id] - deletar um snippet
export async function DELETE(request, { params }) {
  try {
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

    await prisma.snippet.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Snippet deletado com sucesso" });
  } catch (error) {
    console.error("Erro ao deletar snippet:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
