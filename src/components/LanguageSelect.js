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
      { name: "Next.js", value: "nextjs", ext: ".tsx", color: "bg-gray-400" },
      { name: "Vue", value: "vue", ext: ".vue", color: "bg-emerald-400" },
      { name: "Tailwind", value: "tailwind", ext: ".css", color: "bg-cyan-500" },
      { name: "Svelte", value: "svelte", ext: ".svelte", color: "bg-orange-500" },
    ],
  },
  {
    label: "BACKEND",
    languages: [
      { name: "Python", value: "python", ext: ".py", color: "bg-teal-400" },
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

function getLangInfo(value) {
  return allLanguages.find((l) => l.value === value);
}

export default function LanguageSelect({ values = [], onChange }) {
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

  function addLanguage(lang) {
    if (!values.includes(lang)) {
      onChange([...values, lang]);
    }
    setOpen(false);
    setSearch("");
  }

  function removeLanguage(lang) {
    onChange(values.filter((v) => v !== lang));
  }

  const filtered = languageGroups
    .map((group) => ({
      ...group,
      languages: group.languages.filter(
        (l) =>
          !values.includes(l.value) &&
          (l.name.toLowerCase().includes(search.toLowerCase()) ||
            l.value.includes(search.toLowerCase()))
      ),
    }))
    .filter((group) => group.languages.length > 0);

  const isCustom =
    search.trim() &&
    !allLanguages.some(
      (l) =>
        l.value === search.trim().toLowerCase() ||
        l.name.toLowerCase() === search.trim().toLowerCase()
    ) &&
    !values.includes(search.trim().toLowerCase());

  return (
    <div className="relative" ref={ref}>
      <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
        Linguagem
      </label>

      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {values.map((val) => {
            const info = getLangInfo(val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1f1d2e] border border-[#d2a8ff44] text-[#d2a8ff] text-xs rounded-lg"
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    info ? info.color : "bg-purple-400"
                  }`}
                ></span>
                {info ? info.name : val}
                <button
                  type="button"
                  onClick={() => removeLanguage(val)}
                  className="text-[#d2a8ff88] hover:text-[#d2a8ff] ml-0.5"
                >
                  ×
                </button>
              </span>
            );
          })}
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-[#30363d] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent bg-[#0d1117] text-[#e6edf3]"
      >
        <span className="text-[#6e7681]">
          {values.length === 0
            ? "Selecione a linguagem"
            : "Adicionar outra linguagem"}
        </span>
        <svg
          className={`w-4 h-4 text-[#6e7681] transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute z-20 w-full mt-1 bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
          <div className="p-2 border-b border-[#21262d]">
            <input
              ref={searchRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar linguagem..."
              className="w-full px-3 py-1.5 border border-[#30363d] rounded-md text-sm bg-[#0d1117] text-[#e6edf3] placeholder-[#6e7681] focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent"
            />
          </div>

          <div className="max-h-64 overflow-y-auto">
            {filtered.map((group) => (
              <div key={group.label}>
                <p className="px-3 pt-3 pb-1 text-[10px] font-semibold text-[#6e7681] tracking-wider">
                  {group.label}
                </p>
                {group.languages.map((lang) => (
                  <button
                    key={lang.value}
                    type="button"
                    onClick={() => addLanguage(lang.value)}
                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-[#c9d1d9] hover:bg-[#1f1d2e] hover:text-[#d2a8ff]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${lang.color}`}
                      ></span>
                      <span>{lang.name}</span>
                    </div>
                    <span className="text-xs text-[#6e7681]">{lang.ext}</span>
                  </button>
                ))}
              </div>
            ))}

            {isCustom && (
              <div>
                <p className="px-3 pt-3 pb-1 text-[10px] font-semibold text-[#6e7681] tracking-wider">
                  PERSONALIZADA
                </p>
                <button
                  type="button"
                  onClick={() => addLanguage(search.trim().toLowerCase())}
                  className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#c9d1d9] hover:bg-[#1f1d2e] hover:text-[#d2a8ff]"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <span>Adicionar &quot;{search.trim()}&quot;</span>
                </button>
              </div>
            )}

            {filtered.length === 0 && !isCustom && (
              <p className="px-3 py-4 text-sm text-[#6e7681] text-center">
                Nenhuma linguagem encontrada
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
