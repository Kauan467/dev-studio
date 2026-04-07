"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/Sidebar";
import Link from "next/link";

function getLanguageColor(language) {
  const colors = {
    javascript: "bg-amber-100 text-amber-800",
    typescript: "bg-blue-100 text-blue-800",
    python: "bg-teal-100 text-teal-800",
    java: "bg-red-100 text-red-800",
    csharp: "bg-purple-100 text-purple-800",
    cpp: "bg-pink-100 text-pink-800",
    c: "bg-gray-100 text-gray-800",
    go: "bg-cyan-100 text-cyan-800",
    rust: "bg-orange-100 text-orange-800",
    ruby: "bg-red-100 text-red-800",
    php: "bg-indigo-100 text-indigo-800",
    swift: "bg-orange-100 text-orange-800",
    kotlin: "bg-violet-100 text-violet-800",
    dart: "bg-sky-100 text-sky-800",
    sql: "bg-blue-100 text-blue-800",
    postgresql: "bg-blue-100 text-blue-800",
    mysql: "bg-amber-100 text-amber-800",
    mongodb: "bg-green-100 text-green-800",
    html: "bg-orange-100 text-orange-800",
    css: "bg-blue-100 text-blue-800",
    sass: "bg-pink-100 text-pink-800",
    react: "bg-cyan-100 text-cyan-800",
    nextjs: "bg-gray-100 text-gray-800",
    vue: "bg-emerald-100 text-emerald-800",
    angular: "bg-red-100 text-red-800",
    svelte: "bg-orange-100 text-orange-800",
    nodejs: "bg-green-100 text-green-800",
    express: "bg-gray-100 text-gray-800",
    bash: "bg-gray-100 text-gray-800",
    shell: "bg-gray-100 text-gray-800",
    powershell: "bg-blue-100 text-blue-800",
    docker: "bg-sky-100 text-sky-800",
    yaml: "bg-rose-100 text-rose-800",
    json: "bg-lime-100 text-lime-800",
    markdown: "bg-gray-100 text-gray-800",
    git: "bg-orange-100 text-orange-800",
    prisma: "bg-indigo-100 text-indigo-800",
    graphql: "bg-pink-100 text-pink-800",
    tailwind: "bg-cyan-100 text-cyan-800",
  };
  return colors[language] || "bg-gray-100 text-gray-800";
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [snippets, setSnippets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeLanguage, setActiveLanguage] = useState(null);

  async function fetchSnippets() {
    setLoading(true);

    let url = "/api/snippets?";
    if (search) url += `search=${search}&`;
    if (activeLanguage) url += `language=${activeLanguage}&`;

    const res = await fetch(url);
    const data = await res.json();

    if (res.ok) {
      setSnippets(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    fetchSnippets();
  }, [activeLanguage]);

  function handleSearch(e) {
    e.preventDefault();
    fetchSnippets();
  }

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar
        onFilterLanguage={setActiveLanguage}
        activeLanguage={activeLanguage}
      />

      <main className="flex-1 ml-56">
        <div className="px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Meus snippets
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                {snippets.length} snippet{snippets.length !== 1 ? "s" : ""}
                {activeLanguage ? ` em ${activeLanguage}` : ""}
              </p>
            </div>
            <Link
              href="/dashboard/new"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              + Novo snippet
            </Link>
          </div>

          <form onSubmit={handleSearch} className="mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por título ou descrição..."
              className="w-full max-w-md px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </form>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-sm text-gray-400">Carregando...</p>
            </div>
          ) : snippets.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 mb-2">Nenhum snippet encontrado</p>
              <Link
                href="/dashboard/new"
                className="text-purple-600 text-sm hover:underline"
              >
                Criar seu primeiro snippet
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {snippets.map((snippet) => (
                <Link
                  key={snippet.id}
                  href={`/dashboard/${snippet.id}`}
                  className="block bg-gray-50 rounded-lg p-4 border border-gray-100 hover:border-purple-200 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${getLanguageColor(
                        snippet.language
                      )}`}
                    >
                      {snippet.language}
                    </span>
                  </div>
                  <h3 className="font-medium text-sm text-gray-900 mb-1">
                    {snippet.title}
                  </h3>
                  {snippet.description && (
                    <p className="text-xs text-gray-500 mb-3">
                      {snippet.description}
                    </p>
                  )}
                  <pre className="bg-white rounded p-3 text-xs text-gray-600 font-mono overflow-hidden max-h-20 border border-gray-100">
                    {snippet.code}
                  </pre>
                  {snippet.tags?.length > 0 && (
                    <div className="flex gap-1 mt-3 flex-wrap">
                      {snippet.tags.map((st) => (
                        <span
                          key={st.tag.id}
                          className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-500"
                        >
                          {st.tag.name}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
