import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    return NextResponse.json({
      status: "Banco conectado!",
      usuarios: userCount,
    });
  } catch (error) {
    return NextResponse.json(
      { status: "Erro na conexão", erro: error.message },
      { status: 500 }
    );
  }
}