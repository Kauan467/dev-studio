"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import CodeBlock from "@/components/CodeBlock";

function getLanguageBadge(language) {
  const colors = {
    javascript: "bg-[#2d1b00] text-[#f0c14b] border-[#f0c14b44]",
    typescript: "bg-[#0c1d33] text-[#58a6ff] border-[#58a6ff44]",
    python: "bg-[#0c2d1b] text-[#3fb950] border-[#3fb95044]",
    java: "bg-[#2d0c0c] text-[#f78166] border-[#f7816644]",
    sql: "bg-[#0c1d33] text-[#58a6ff] border-[#58a6ff44]",
    react: "bg-[#0c2333] text-[#58d5f0] border-[#58d5f044]",
    nextjs: "bg-[#1c1c1c] text-[#8b949e] border-[#8b949e44]",
    nodejs: "bg-[#0c2d1b] text-[#3fb950] border-[#3fb95044]",
    bash: "bg-[#1c1c1c] text-[#8b949e] border-[#8b949e44]",
    html: "bg-[#2d1500] text-[#f0883e] border-[#f0883e44]",
    css: "bg-[#0c1d33] text-[#58a6ff] border-[#58a6ff44]",
    php: "bg-[#1a1033] text-[#a371f7] border-[#a371f744]",
    docker: "bg-[#0c2333] text-[#58d5f0] border-[#58d5f044]",
    prisma: "bg-[#1a1033] text-[#a371f7] border-[#a371f744]",
    go: "bg-[#0c2333] text-[#58d5f0] border-[#58d5f044]",
    rust: "bg-[#2d1500] text-[#f0883e] border-[#f0883e44]",
    ruby: "bg-[#2d0c0c] text-[#f78166] border-[#f7816644]",
    csharp: "bg-[#1a1033] text-[#d2a8ff] border-[#d2a8ff44]",
    vue: "bg-[#0c2d1b] text-[#3fb950] border-[#3fb95044]",
    json: "bg-[#1c2d0c] text-[#7ee787] border-[#7ee78744]",
    yaml: "bg-[#2d0c1a] text-[#f778ba] border-[#f778ba44]",
    graphql: "bg-[#2d0c1a] text-[#f778ba] border-[#f778ba44]",
    tailwind: "bg-[#0c2333] text-[#58d5f0] border-[#58d5f044]",
  };
  return colors[language] || "bg-[#1a1033] text-[#d2a8ff] border-[#d2a8ff44]";
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [snippets, setSnippets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [activeLanguage, setActiveLanguage] = useState(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchSnippets();
      fetchLanguages();
    }
  }, [status, activeLanguage, search]);

  async function fetchSnippets() {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeLanguage) params.set("language", activeLanguage);
    if (search) params.set("search", search);

    try {
      const res = await fetch(`/api/snippets?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setSnippets(data);
      }
    } catch (err) {
      console.error("Erro ao buscar snippets:", err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchLanguages() {
    try {
      const res = await fetch("/api/snippets/languages");
      if (res.ok) {
        const data = await res.json();
        setLanguages(data);
      }
    } catch (err) {
      console.error("Erro ao buscar linguagens:", err);
    }
  }

  function handleFilterLanguage(lang) {
    setActiveLanguage(lang);
  }

  function handleReorderLanguages(reordered) {
    setLanguages(reordered);
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="w-6 h-6 border-2 border-[#21262d] border-t-[#d2a8ff] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Sidebar
        onFilterLanguage={handleFilterLanguage}
        activeLanguage={activeLanguage}
        languages={languages}
        onReorderLanguages={handleReorderLanguages}
      />

      <main className="ml-56 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-[#e6edf3]">Meus Snippets</h1>
              <p className="text-sm text-[#484f58] mt-1">
                {snippets.length} snippet{snippets.length !== 1 ? "s" : ""} salvo{snippets.length !== 1 ? "s" : ""}
              </p>
            </div>
            <Link
              href="/dashboard/new"
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-lg hover:bg-purple-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Novo snippet
            </Link>
          </div>

          {/* ── BUSCA MELHORADA ── */}
          <div className="mb-6 relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#484f58] pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <circle cx="11" cy="11" r="8" strokeWidth={2} />
              <path d="M21 21l-4.35-4.35" strokeWidth={2} strokeLinecap="round" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar snippets..."
              className="w-full pl-9 pr-16 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent transition-colors hover:border-[#484f58]"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#484f58] bg-[#161b22] border border-[#30363d] rounded px-1.5 py-0.5 font-sans pointer-events-none">
              ⌘K
            </kbd>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-[#21262d] border-t-[#d2a8ff] rounded-full animate-spin"></div>
            </div>
          ) : snippets.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-12 h-12 text-[#21262d] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              <p className="text-[#484f58] text-sm">Nenhum snippet encontrado</p>
              <Link
                href="/dashboard/new"
                className="inline-block mt-4 text-sm text-[#d2a8ff] hover:underline"
              >
                Criar seu primeiro snippet
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {snippets.map((snippet) => (
                <Link
                  href={`/dashboard/${snippet.id}`}
                  key={snippet.id}
                  className="group bg-[#161b22] border border-[#21262d] rounded-xl p-5 hover:border-[#d2a8ff33] transition-all duration-200 flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-sm font-semibold text-[#e6edf3] truncate flex-1 mr-2">
                      {snippet.title}
                    </h2>
                    <span
                      className={`text-[10px] px-2 py-1 rounded-full border whitespace-nowrap shrink-0 font-medium ${getLanguageBadge(
                        snippet.language.split(",")[0].trim()
                      )}`}
                    >
                      {snippet.language}
                    </span>
                  </div>
                  {snippet.description && (
                    <p className="text-xs text-[#8b949e] mb-3 line-clamp-2 leading-relaxed">
                      {snippet.description}
                    </p>
                  )}

                  <div className="flex-1 mb-3">
                    <CodeBlock
                      code={snippet.code}
                      language={snippet.language.split(",")[0].trim()}
                      maxHeight="150px"
                      showCopy={true}
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
                    <div className="flex flex-wrap gap-1.5">
                      {snippet.tags && snippet.tags.length > 0
                        ? snippet.tags.map((t) => (
                            <span
                              key={t.tag.id}
                              className="text-[10px] px-2 py-0.5 bg-[#1f1d2e] border border-[#d2a8ff22] text-[#d2a8ff] rounded-full"
                            >
                              {t.tag.name}
                            </span>
                          ))
                        : null}
                    </div>
                    <p className="text-[10px] text-[#484f58] shrink-0 ml-2">
                      {new Date(snippet.updatedAt).toLocaleDateString("pt-BR", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
