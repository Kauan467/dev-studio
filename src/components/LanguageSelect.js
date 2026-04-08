"use client";

import { useState, useRef, useEffect } from "react";

const languageGroups = [
  {
    label: "FRONTEND",
    languages: [
      { name: "JavaScript", value: "javascript", ext: ".js", color: "bg-amber-400" },
      { name: "TypeScript", value: "typescript", ext: ".ts", color: "bg-blue-400" },
      { name: "HTML", value: "html", ext: ".html", color: "bg-orange-400" },
      { name: "CSS", value: "css", ext: ".css", color: "bg-blue-500" },
      { name: "React", value: "react", ext: ".jsx", color: "bg-cyan-400" },
      { name: "Next.js", value: "nextjs", ext: ".tsx", color: "bg-gray-500" },
      { name: "Vue", value: "vue", ext: ".vue", color: "bg-emerald-400" },
      { name: "Tailwind", value: "tailwind", ext: ".css", color: "bg-cyan-500" },
      { name: "Svelte", value: "svelte", ext: ".svelte", color: "bg-orange-500" },
    ],
  },
  {
    label: "BACKEND",
    languages: [
      { name: "Python", value: "python", ext: ".py", color: "bg-blue-400" },
      { name: "Java", value: "java", ext: ".java", color: "bg-orange-400" },
      { name: "Go", value: "go", ext: ".go", color: "bg-cyan-400" },
      { name: "Rust", value: "rust", ext: ".rs", color: "bg-orange-500" },
      { name: "Ruby", value: "ruby", ext: ".rb", color: "bg-red-400" },
      { name: "PHP", value: "php", ext: ".php", color: "bg-indigo-400" },
      { name: "C#", value: "csharp", ext: ".cs", color: "bg-purple-400" },
      { name: "Node.js", value: "nodejs", ext: ".js", color: "bg-green-400" },
      { name: "Express", value: "express", ext: ".js", color: "bg-gray-400" },
    ],
  },
  {
    label: "BANCO DE DADOS",
    languages: [
      { name: "SQL", value: "sql", ext: ".sql", color: "bg-blue-400" },
      { name: "PostgreSQL", value: "postgresql", ext: ".sql", color: "bg-blue-500" },
      { name: "MySQL", value: "mysql", ext: ".sql", color: "bg-amber-400" },
      { name: "MongoDB", value: "mongodb", ext: ".js", color: "bg-green-400" },
      { name: "Prisma", value: "prisma", ext: ".prisma", color: "bg-indigo-400" },
      { name: "GraphQL", value: "graphql", ext: ".gql", color: "bg-pink-400" },
    ],
  },
  {
    label: "FERRAMENTAS",
    languages: [
      { name: "Bash", value: "bash", ext: ".sh", color: "bg-gray-400" },
      { name: "PowerShell", value: "powershell", ext: ".ps1", color: "bg-blue-400" },
      { name: "Docker", value: "docker", ext: "", color: "bg-sky-400" },
      { name: "Git", value: "git", ext: "", color: "bg-orange-400" },
      { name: "JSON", value: "json", ext: ".json", color: "bg-lime-400" },
      { name: "YAML", value: "yaml", ext: ".yml", color: "bg-rose-400" },
      { name: "Markdown", value: "markdown", ext: ".md", color: "bg-gray-400" },
    ],
  },
];

const allLanguages = languageGroups.flatMap((g) => g.languages);

export default function LanguageSelect({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus();
    }
  }, [open]);

  const selected = allLanguages.find((l) => l.value === value);

  const filtered = languageGroups
    .map((group) => ({
      ...group,
      languages: group.languages.filter((l) =>
        l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.value.includes(search.toLowerCase())
      ),
    }))
    .filter((group) => group.languages.length > 0);

  const isCustom = search.trim() && !allLanguages.some(
    (l) => l.value === search.trim().toLowerCase() || l.name.toLowerCase() === search.trim().toLowerCase()
  );

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Linguagem
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
      >
        {selected ? (
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${selected.color}`}></span>
            <span>{selected.name}</span>
          </div>
        ) : value ? (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span>{value}</span>
          </div>
        ) : (
          <span className="text-gray-400">Selecione a linguagem</span>
        )}
        <svg
          className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          <div className="p-2 border-b border-gray-100">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar linguagem..."
              className="w-full px-3 py-1.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filtered.map((group) => (
              <div key={group.label}>
                <p className="px-3 pt-3 pb-1 text-xs font-medium text-gray-400 tracking-wide">
                  {group.label}
                </p>
                {group.languages.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => {
                      onChange(lang.value);
                      setOpen(false);
                      setSearch("");
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 text-sm hover:bg-purple-50 ${
                      value === lang.value ? "bg-purple-50 text-purple-700" : "text-gray-700"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${lang.color}`}></span>
                      <span>{lang.name}</span>
                    </div>
                    <span className="text-xs text-gray-400">{lang.ext}</span>
                  </button>
                ))}
              </div>
            ))}

            {isCustom && (
              <div>
                <p className="px-3 pt-3 pb-1 text-xs font-medium text-gray-400 tracking-wide">
                  PERSONALIZADA
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onChange(search.trim().toLowerCase());
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-purple-50"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <span>Adicionar "{search.trim()}"</span>
                </button>
              </div>
            )}

            {filtered.length === 0 && !isCustom && (
              <p className="px-3 py-4 text-sm text-gray-400 text-center">
                Nenhuma linguagem encontrada
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
