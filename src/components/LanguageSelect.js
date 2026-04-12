"use client";

import { useState, useRef, useEffect } from "react";

const languageGroups = [
  {
    label: "FRONTEND",
    languages: [
      { name: "JavaScript", value: "javascript", color: "bg-amber-400" },
      { name: "TypeScript", value: "typescript", color: "bg-blue-400" },
      { name: "HTML", value: "html", color: "bg-orange-400" },
      { name: "CSS", value: "css", color: "bg-blue-500" },
      { name: "React", value: "react", color: "bg-cyan-400" },
      { name: "Next.js", value: "nextjs", color: "bg-gray-400" },
      { name: "Vue", value: "vue", color: "bg-emerald-400" },
      { name: "Tailwind", value: "tailwind", color: "bg-cyan-500" },
    ],
  },
  {
    label: "BACKEND",
    languages: [
      { name: "Python", value: "python", color: "bg-teal-400" },
      { name: "Java", value: "java", color: "bg-orange-400" },
      { name: "Go", value: "go", color: "bg-cyan-400" },
      { name: "Rust", value: "rust", color: "bg-orange-500" },
      { name: "Ruby", value: "ruby", color: "bg-red-400" },
      { name: "PHP", value: "php", color: "bg-indigo-400" },
      { name: "C#", value: "csharp", color: "bg-purple-400" },
      { name: "Node.js", value: "nodejs", color: "bg-green-400" },
    ],
  },
  {
    label: "BANCO DE DADOS",
    languages: [
      { name: "SQL", value: "sql", color: "bg-blue-400" },
      { name: "PostgreSQL", value: "postgresql", color: "bg-blue-500" },
      { name: "MongoDB", value: "mongodb", color: "bg-green-400" },
      { name: "Prisma", value: "prisma", color: "bg-indigo-400" },
      { name: "GraphQL", value: "graphql", color: "bg-pink-400" },
    ],
  },
  {
    label: "FERRAMENTAS",
    languages: [
      { name: "Bash", value: "bash", color: "bg-gray-400" },
      { name: "Docker", value: "docker", color: "bg-sky-400" },
      { name: "JSON", value: "json", color: "bg-lime-400" },
      { name: "YAML", value: "yaml", color: "bg-rose-400" },
      { name: "Markdown", value: "markdown", color: "bg-gray-400" },
    ],
  },
];

const allLanguages = languageGroups.flatMap((g) => g.languages);

function getLangInfo(value) {
  return allLanguages.find((l) => l.value === value);
}

export default function LanguageSelect({ value, values, onChange }) {
  const isMulti = values !== undefined;
  const selectedValues = isMulti ? values : value ? [value] : [];

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) {
      setTimeout(() => {
        document.addEventListener("click", handleClick);
      }, 0);
    }
    return () => document.removeEventListener("click", handleClick);
  }, [open]);

  function handleSelect(langValue) {
    if (isMulti) {
      onChange([...selectedValues, langValue]);
    } else {
      onChange(langValue);
    }
    setSearch("");
    setOpen(false);
  }

  function handleRemove(langValue) {
    if (isMulti) {
      onChange(selectedValues.filter((v) => v !== langValue));
    } else {
      onChange("");
    }
  }

  const filtered = languageGroups
    .map((group) => ({
      ...group,
      languages: group.languages.filter(
        (l) =>
          !selectedValues.includes(l.value) &&
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
    !selectedValues.includes(search.trim().toLowerCase());

  return (
    <div ref={containerRef}>
      <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
        Linguagem
      </label>

      {selectedValues.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedValues.map((val) => {
            const info = getLangInfo(val);
            return (
              <span
                key={val}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#1f1d2e] border border-[#d2a8ff44] text-[#d2a8ff] text-xs rounded-lg"
              >
                <span className={`w-2 h-2 rounded-full ${info ? info.color : "bg-purple-400"}`}></span>
                {info ? info.name : val}
                <span
                  onClick={() => handleRemove(val)}
                  className="text-[#d2a8ff88] hover:text-[#d2a8ff] ml-0.5 cursor-pointer"
                >
                  ×
                </span>
              </span>
            );
          })}
        </div>
      )}

      <div
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 border border-[#30363d] rounded-lg text-sm bg-[#0d1117] text-[#e6edf3] cursor-pointer"
      >
        <span className="text-[#6e7681]">
          {selectedValues.length === 0 ? "Selecione a linguagem" : isMulti ? "Adicionar outra linguagem" : "Alterar linguagem"}
        </span>
        <svg
          className={`w-4 h-4 text-[#6e7681] transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {open && (
        <div className="mt-1 bg-[#161b22] border border-[#30363d] rounded-lg overflow-hidden">
          <div className="p-2 border-b border-[#21262d]">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar linguagem..."
              autoFocus
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
                  <div
                    key={lang.value}
                    onClick={() => handleSelect(lang.value)}
                    className="flex items-center justify-between px-3 py-2 text-sm text-[#c9d1d9] hover:bg-[#1f1d2e] hover:text-[#d2a8ff] cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${lang.color}`}></span>
                      <span>{lang.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            ))}

            {isCustom && (
              <div>
                <p className="px-3 pt-3 pb-1 text-[10px] font-semibold text-[#6e7681] tracking-wider">
                  PERSONALIZADA
                </p>
                <div
                  onClick={() => handleSelect(search.trim().toLowerCase())}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-[#c9d1d9] hover:bg-[#1f1d2e] hover:text-[#d2a8ff] cursor-pointer"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                  <span>Adicionar &quot;{search.trim()}&quot;</span>
                </div>
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
