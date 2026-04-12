"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import CodeBlock from "@/components/CodeBlock";

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

          <div className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar snippets..."
              className="w-full px-4 py-2.5 bg-[#0d1117] border border-[#21262d] rounded-lg text-sm text-[#e6edf3] placeholder-[#484f58] focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent"
            />
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
                <div
                  key={snippet.id}
                  className="bg-[#161b22] border border-[#21262d] rounded-xl p-5 hover:border-[#30363d] transition-colors flex flex-col"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h2 className="text-sm font-semibold text-[#d2a8ff] truncate flex-1 mr-2">
                      {snippet.title}
                    </h2>
                    <span className="text-[10px] text-[#484f58] bg-[#0d1117] border border-[#21262d] px-2 py-1 rounded-md whitespace-nowrap shrink-0">
                      {snippet.language}
                    </span>
                  </div>

                  {snippet.description && (
                    <p className="text-xs text-white mb-3 line-clamp-2">
                      {snippet.description}
                    </p>
                  )}

                  <div className="flex-1">
                    <CodeBlock
                      code={snippet.code}
                      language={snippet.language.split(",")[0].trim()}
                      maxHeight="150px"
                      showCopy={true}
                    />
                  </div>

                  {snippet.tags && snippet.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {snippet.tags.map((t) => (
                        <span
                          key={t.tag.id}
                          className="text-[10px] px-2 py-0.5 bg-[#1f1d2e] border border-[#d2a8ff22] text-[#d2a8ff] rounded-full"
                        >
                          {t.tag.name}
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-[10px] text-white mt-3">
                    {new Date(snippet.updatedAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
