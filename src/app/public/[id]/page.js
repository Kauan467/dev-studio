import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import CodeBlock from "@/components/CodeBlock";
import Logo from "@/components/Logo";
import Link from "next/link";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const snippet = await prisma.snippet.findUnique({ where: { id } });
  if (!snippet || !snippet.isPublic) return { title: "Dev Studio" };
  return { title: snippet.title };
}

export default async function PublicSnippetPage({ params }) {
  const { id } = await params;

  const snippet = await prisma.snippet.findUnique({
    where: { id },
    include: {
      tags: { include: { tag: true } },
      user: { select: { name: true } },
    },
  });

  if (!snippet || !snippet.isPublic) notFound();

  const languages = snippet.language?.split(",").map((l) => l.trim()).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <header className="border-b border-[#21262d] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard">
          <Logo size="default" />
        </Link>
        <Link
          href="/login"
          className="text-xs text-[#8b949e] hover:text-[#d2a8ff] transition-colors"
        >
          Entrar no Dev Studio →
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {languages.map((lang) => (
              <span key={lang} className="text-xs px-2.5 py-1 rounded-full bg-[#1f1d2e] border border-[#d2a8ff44] text-[#d2a8ff]">
                {lang}
              </span>
            ))}
            <span className="text-xs text-[#484f58] ml-auto">
              por {snippet.user.name} · {new Date(snippet.updatedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-2xl font-bold text-[#e6edf3] mb-2">{snippet.title}</h1>

          {snippet.description && (
            <p className="text-sm text-[#8b949e]">{snippet.description}</p>
          )}
        </div>

        <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
          <CodeBlock
            code={snippet.code}
            language={languages[0] ?? "text"}
            showCopy={true}
          />

          {snippet.tags && snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 mt-4 border-t border-[#21262d]">
              {snippet.tags.map((t) => (
                <span key={t.tag.id} className="text-xs px-2.5 py-1 rounded-full bg-[#1f1d2e] border border-[#d2a8ff44] text-[#d2a8ff]">
                  {t.tag.name}
                </span>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#484f58] mt-8">
          Compartilhado via{" "}
          <Link href="/login" className="text-[#d2a8ff] hover:underline">
            Dev Studio
          </Link>
        </p>
      </main>
    </div>
  );
}
