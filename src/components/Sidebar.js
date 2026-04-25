"use client";

import { useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Logo from "./Logo";

const languageColors = {
  javascript: "bg-amber-400",
  typescript: "bg-blue-400",
  python: "bg-teal-400",
  java: "bg-red-400",
  sql: "bg-blue-500",
  react: "bg-cyan-400",
  bash: "bg-gray-400",
  html: "bg-orange-400",
  css: "bg-blue-400",
  nodejs: "bg-green-400",
  nextjs: "bg-gray-500",
  php: "bg-indigo-400",
  docker: "bg-sky-400",
  prisma: "bg-indigo-400",
  go: "bg-cyan-400",
  rust: "bg-orange-500",
  ruby: "bg-red-400",
  csharp: "bg-purple-400",
  vue: "bg-emerald-400",
  json: "bg-lime-400",
  yaml: "bg-rose-400",
  markdown: "bg-gray-400",
  graphql: "bg-pink-400",
  tailwind: "bg-cyan-500",
};

function getColor(language) {
  return languageColors[language] || "bg-purple-400";
}

export default function Sidebar({
  onFilterLanguage,
  activeLanguage,
  languages,
  onReorderLanguages,
  onFilterFavorite,
  activeFavorite,
}) {
  const { data: session } = useSession();
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);
  const dragNode = useRef(null);

  function handleDragStart(e, index) {
    setDragIndex(index);
    dragNode.current = e.target;
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e, index) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (index !== overIndex) setOverIndex(index);
  }

  function handleDragEnd() {
    if (dragIndex !== null && overIndex !== null && dragIndex !== overIndex && onReorderLanguages) {
      const reordered = [...languages];
      const [moved] = reordered.splice(dragIndex, 1);
      reordered.splice(overIndex, 0, moved);
      onReorderLanguages(reordered);
    }
    setDragIndex(null);
    setOverIndex(null);
    dragNode.current = null;
  }

  return (
    <aside className="w-56 bg-[#010409] border-r border-[#21262d] h-screen flex flex-col fixed left-0 top-0">
      <div className="px-4 py-4 border-b border-[#21262d]">
        <Link href="/dashboard">
          <Logo size="default" />
        </Link>
      </div>

      <nav className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">
        <button
          onClick={() => {
            onFilterLanguage(null);
            onFilterFavorite(false);
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            activeLanguage === null && !activeFavorite
              ? "bg-[#1f1d2e] text-[#d2a8ff] font-medium"
              : "text-[#8b949e] hover:bg-[#161b22]"
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
          </svg>
          Todos os snippets
        </button>

        <button
          onClick={() => {
            onFilterLanguage(null);
            onFilterFavorite(true);
          }}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
            activeFavorite
              ? "bg-[#1f1d2e] text-[#f0c14b] font-medium"
              : "text-[#8b949e] hover:bg-[#161b22]"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill={activeFavorite ? "currentColor" : "none"}
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
          Favoritos
        </button>

        {languages.length > 0 && (
          <div className="pt-3">
            <p className="px-3 text-[10px] font-semibold text-[#484f58] uppercase tracking-wider mb-2">
              Linguagens
            </p>
            {languages.map((lang, index) => (
              <div
                key={lang.language}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className={`transition-all ${
                  dragIndex === index ? "opacity-40" : ""
                } ${
                  overIndex === index && dragIndex !== null && dragIndex !== index
                    ? "border-t-2 border-[#d2a8ff]"
                    : "border-t-2 border-transparent"
                }`}
              >
                <button
                  onClick={() => {
                    onFilterLanguage(lang.language);
                    onFilterFavorite(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors cursor-grab active:cursor-grabbing ${
                    activeLanguage === lang.language
                      ? "bg-[#1f1d2e] text-[#d2a8ff] font-medium"
                      : "text-[#8b949e] hover:bg-[#161b22]"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${getColor(lang.language)}`}></span>
                    {lang.language}
                  </div>
                  <span className="text-[10px] text-[#484f58] bg-[#21262d] px-1.5 py-0.5 rounded-full">
                    {lang._count.language}
                  </span>
                </button>
              </div>
            ))}
          </div>
        )}
      </nav>

      <div className="px-3 py-3 border-t border-[#21262d]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1f1d2e] flex items-center justify-center text-xs font-bold text-[#d2a8ff]">
              {session?.user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <p className="text-xs font-medium text-[#e6edf3] leading-tight">
                {session?.user?.name || "Usuário"}
              </p>
              <p className="text-[10px] text-[#484f58] leading-tight">
                {session?.user?.email || ""}
              </p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-[#484f58] hover:text-red-400 transition-colors"
            title="Sair"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}