"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const languageColors = {
  javascript: "bg-amber-100 border-amber-400",
  typescript: "bg-blue-100 border-blue-400",
  python: "bg-teal-100 border-teal-400",
  java: "bg-red-100 border-red-400",
  sql: "bg-blue-100 border-blue-400",
  react: "bg-purple-100 border-purple-400",
  bash: "bg-gray-100 border-gray-400",
  html: "bg-orange-100 border-orange-400",
  css: "bg-blue-100 border-blue-400",
  nodejs: "bg-green-100 border-green-400",
  nextjs: "bg-gray-100 border-gray-400",
  php: "bg-indigo-100 border-indigo-400",
  docker: "bg-sky-100 border-sky-400",
  prisma: "bg-indigo-100 border-indigo-400",
};

function getColor(language) {
  return languageColors[language] || "bg-gray-100 border-gray-400";
}

export default function Sidebar({ onFilterLanguage, activeLanguage, languages }) {
  const { data: session } = useSession();

  return (
    <aside className="w-56 border-r border-gray-200 bg-white h-screen flex flex-col fixed left-0 top-0">
      <div className="px-4 py-4 border-b border-gray-200">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-base font-bold text-gray-900">Dev Studio</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        <button
          onClick={() => onFilterLanguage(null)}
          className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm ${
            activeLanguage === null
              ? "bg-purple-50 text-purple-700 font-medium"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 10h16M4 14h16M4 18h16"
            />
          </svg>
          Todos os snippets
        </button>

        {languages.length > 0 && (
          <div className="pt-4">
            <p className="px-3 text-xs font-medium text-gray-400 uppercase tracking-wide mb-2">
              Linguagens
            </p>
            {languages.map((lang) => (
              <button
                key={lang.language}
                onClick={() => onFilterLanguage(lang.language)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                  activeLanguage === lang.language
                    ? "bg-purple-50 text-purple-700 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full border ${getColor(lang.language)}`}
                  ></span>
                  {lang.language}
                </div>
                <span className="text-xs text-gray-400">
                  {lang._count.language}
                </span>
              </button>
            ))}
          </div>
        )}
      </nav>

      <div className="px-3 py-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-xs font-medium text-purple-700">
              {session?.user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <span className="text-sm text-gray-700">
              {session?.user?.name || "Usuário"}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="text-gray-400 hover:text-gray-600"
            title="Sair"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
}
