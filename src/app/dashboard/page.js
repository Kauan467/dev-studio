"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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

const SORT_OPTIONS = [
  { value: "recent", label: "Mais recente" },
  { value: "oldest", label: "Mais antigo" },
  { value: "az", label: "A-Z" },
];

function sortSnippets(snippets, sort) {
  const arr = [...snippets];
  if (sort === "oldest") return arr.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
  if (sort === "az") return arr.sort((a, b) => a.title.localeCompare(b.title));
  return arr.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
}

function buildBackUrl({ search, sort, language, favorite }) {
  const params = new URLSearchParams();
  if (search) params.set("search", search);
  if (sort && sort !== "recent") params.set("sort", sort);
  if (language) params.set("language", language);
  if (favorite) params.set("favorite", "true");
  const qs = params.toString();
  return qs ? `/dashboard?${qs}` : "/dashboard";
}

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [snippets, setSnippets] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [activeLanguage, setActiveLanguage] = useState(null);
  const [activeFavorite, setActiveFavorite] = useState(false);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const searchRef = useRef(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        searchRef.current?.focus();
        searchRef.current?.select();
      }
      if (e.key === "Escape") searchRef.current?.blur();
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const fetchSnippets = useCallback(async ({ language, favorite, searchTerm }) => {
    setLoading(true);
    const params = new URLSearchParams();
    if (language) params.set("language", language);
    if (favorite) params.set("favorite", "true");
    if (searchTerm) params.set("search", searchTerm);
    try {
      const res = await fetch(`/api/snippets?${params.toString()}`);
      if (res.ok) setSnippets(await res.json());
    } catch (err) {
      console.error("Erro ao buscar snippets:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLanguages = useCallback(async () => {
    try {
      const res = await fetch("/api/snippets/languages");
      if (res.ok) setLanguages(await res.json());
    } catch (err) {
      console.error("Erro ao buscar linguagens:", err);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchSnippets({ language: activeLanguage, favorite: activeFavorite, searchTerm: search });
    fetchLanguages();
  }, [status, activeLanguage, activeFavorite, search, fetchSnippets, fetchLanguages]);

  async function handleToggleFavorite(e, snippetId) {
    e.preventDefault();
    e.stopPropagation();
    if (togglingId === snippetId) return;
    setTogglingId(snippetId);
    setSnippets((prev) =>
      prev.map((s) => s.id === snippetId ? { ...s, isFavorite: !s.isFavorite } : s)
    );
    try {
      const res = await fetch(`/api/snippets/${snippetId}/favorite`, { method: "PATCH" });
      if (!res.ok) throw new Error();
    } catch {
      setSnippets((prev) =>
        prev.map((s) => s.id === snippetId ? { ...s, isFavorite: !s.isFavorite } : s)
      );
    } finally {
      setTogglingId(null);
      if (activeFavorite) {
        fetchSnippets({ language: activeLanguage, favorite: activeFavorite, searchTerm: search });
      }
    }
  }

  const sorted = sortSnippets(snippets, sort);

  const backUrl = buildBackUrl({
    search,
    sort,
    language: activeLanguage,
    favorite: activeFavorite,
  });

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
        onFilterLanguage={setActiveLanguage}
        activeLanguage={activeLanguage}
        languages={languages}
        onReorderLanguages={setLanguages}
        onFilterFavorite={setActiveFavorite}
        activeFavorite={activeFavorite}
      />

      <main className="ml-56 p-6">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-[#e6edf3]">
                {activeFavorite ? "Favoritos" : "Meus Snippets"}
              </h1>
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

          <div className="mb-6 flex gap-3">
            <div className="relative flex-1">
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
                ref={searchRef}
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
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="px-3 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent transition-colors hover:border-[#484f58] cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-6 h-6 border-2 border-[#21262d] border-t-[#d2a8ff] rounded-full animate-spin"></div>
            </div>
          ) : sorted.length === 0 ? (
            <div className="text-center py-20">
              <svg className="w-12 h-12 text-[#21262d] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {activeFavorite ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                )}
              </svg>
              <p className="text-[#484f58] text-sm">
                {activeFavorite ? "Nenhum snippet favoritado ainda" : "Nenhum snippet encontrado"}
              </p>
              {!activeFavorite && (
                <Link href="/dashboard/new" className="inline-block mt-4 text-sm text-[#d2a8ff] hover:underline">
                  Criar seu primeiro snippet
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-5">
              {sorted.map((snippet) => (
                <Link
                  href={`/dashboard/${snippet.id}?back=${encodeURIComponent(backUrl)}`}
                  key={snippet.id}
                  className="group bg-[#161b22] border border-[#21262d] rounded-xl p-5 hover:border-[#d2a8ff33] transition-all duration-200 flex flex-col h-[400px]"
                >
                  <div className="flex items-start justify-between mb-2 shrink-0">
                    <h2 className="text-sm font-semibold text-[#e6edf3] truncate flex-1 mr-2">
                      {snippet.title}
                    </h2>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={(e) => handleToggleFavorite(e, snippet.id)}
                        disabled={togglingId === snippet.id}
                        title={snippet.isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                        className={`p-1 rounded transition-all ${
                          snippet.isFavorite
                            ? "text-[#f0c14b]"
                            : "text-[#484f58] opacity-0 group-hover:opacity-100 hover:text-[#f0c14b]"
                        }`}
                      >
                        <svg
                          className="w-4 h-4"
                          fill={snippet.isFavorite ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                          />
                        </svg>
                      </button>
                      <span
                        className={`text-[10px] px-2 py-1 rounded-full border whitespace-nowrap font-medium ${getLanguageBadge(
                          snippet.language.split(",")[0].trim()
                        )}`}
                      >
                        {snippet.language}
                      </span>
                    </div>
                  </div>

                  {snippet.description && (
                    <p className="text-xs text-[#8b949e] mb-2 line-clamp-1 leading-relaxed shrink-0">
                      {snippet.description}
                    </p>
                  )}

                  <div className="flex-1 min-h-0 overflow-hidden rounded-lg mb-3 relative">
                    <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#0d1117] to-transparent z-10 pointer-events-none rounded-b-lg" />
                    <div
                      className="h-full overflow-hidden"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <CodeBlock
                        code={snippet.code}
                        language={snippet.language.split(",")[0].trim()}
                        maxHeight="100%"
                        showCopy={true}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#21262d] shrink-0">
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
