"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LanguageSelect from "@/components/LanguageSelect";

export default function NewSnippetPage() {
  const { status } = useSession();
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [code, setCode] = useState("");
  const [languages, setLanguages] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleAddTag(e) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const newTag = tagInput.trim().toLowerCase();

      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }

      setTagInput("");
    }
  }

  function handleRemoveTag(tagToRemove) {
    setTags(tags.filter((t) => t !== tagToRemove));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!title || !code || languages.length === 0) {
      setError("Título, código e pelo menos uma linguagem são obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: description || null,
          code,
          language: languages.join(", "),
          tags: tags.length > 0 ? tags : null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao criar snippet");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      setError("Erro de conexão com o servidor");
      setLoading(false);
    }
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
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-xl font-bold text-[#e6edf3]">Novo snippet</h1>
            <p className="text-sm text-[#6e7681] mt-1">
              Salve um trecho de código para consultar depois
            </p>
          </div>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-[#8b949e] border border-[#30363d] rounded-lg hover:bg-[#161b22] hover:text-[#e6edf3] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar
          </Link>
        </div>

        {error && (
          <div className="bg-[#2d0c0c] border border-[#f7816633] text-[#f78166] text-sm px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Título
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Descrição{" "}
              <span className="text-[#6e7681] font-normal">(opcional)</span>
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent"
            />
          </div>

          <LanguageSelect values={languages} onChange={setLanguages} />

          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Código
            </label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              rows={10}
              className="w-full px-3 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] font-mono focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#c9d1d9] mb-2">
              Tags{" "}
              <span className="text-[#6e7681] font-normal">
                (pressione Enter para adicionar)
              </span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-[#1f1d2e] border border-[#d2a8ff44] text-[#d2a8ff] text-xs rounded-lg"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-[#d2a8ff88] hover:text-[#d2a8ff]"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              className="w-full px-3 py-2.5 bg-[#0d1117] border border-[#30363d] rounded-lg text-sm text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Salvando..." : "Salvar snippet"}
            </button>
            <Link
              href="/dashboard"
              className="px-6 py-2.5 rounded-lg text-sm text-[#8b949e] border border-[#30363d] hover:bg-[#161b22] hover:text-[#c9d1d9] transition-colors"
            >
              Cancelar
            </Link>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}
