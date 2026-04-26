"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import CodeBlock from "@/components/CodeBlock";

export default function SnippetPage({ params }) {
  const { id } = use(params);
  const { status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const backUrl = searchParams.get("back") || "/dashboard";

  const [snippet, setSnippet] = useState(null);
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [togglingFav, setTogglingFav] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetchSnippet();
    fetchLanguages();
  }, [status, id]);

  async function fetchSnippet() {
    setLoading(true);
    try {
      const res = await fetch(`/api/snippets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSnippet(data);
        setIsFavorite(data.isFavorite ?? false);
      } else {
        setError("Snippet não encontrado");
      }
    } catch {
      setError("Erro ao carregar snippet");
    } finally {
      setLoading(false);
    }
  }

  async function fetchLanguages() {
    try {
      const res = await fetch("/api/snippets/languages");
      if (res.ok) setLanguages(await res.json());
    } catch {}
  }

  async function handleToggleFavorite() {
    setTogglingFav(true);
    setIsFavorite((prev) => !prev);
    try {
      await fetch(`/api/snippets/${id}/favorite`, { method: "PATCH" });
    } catch {
      setIsFavorite((prev) => !prev);
    } finally {
      setTogglingFav(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError("Erro ao deletar snippet");
      }
    } catch {
      setError("Erro de conexão");
    } finally {
      setDeleting(false);
    }
  }

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="w-6 h-6 border-2 border-[#21262d] border-t-[#d2a8ff] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
        <div className="text-center">
          <p className="text-[#f78166] mb-4">{error}</p>
          <Link href="/dashboard" className="text-sm text-[#d2a8ff] hover:underline">
            Voltar ao dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!snippet) return null;

  const snippetLanguages = snippet.language?.split(",").map((l) => l.trim()).filter(Boolean) ?? [];

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <Sidebar
        onFilterLanguage={() => {}}
        activeLanguage={null}
        languages={languages}
        onReorderLanguages={() => {}}
        onFilterFavorite={() => {}}
        activeFavorite={false}
      />

      <main className="ml-56 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link
              href={backUrl}
              className="inline-flex items-center gap-1 text-sm text-[#8b949e] hover:text-[#d2a8ff] transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Voltar
            </Link>

            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleFavorite}
                disabled={togglingFav}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                  isFavorite
                    ? "text-[#f0c14b] border-[#f0c14b44] bg-[#2d1b0033] hover:bg-[#2d1b00]"
                    : "text-[#8b949e] border-[#30363d] hover:bg-[#161b22] hover:text-[#f0c14b]"
                }`}
              >
                <svg
                  className="w-3.5 h-3.5"
                  fill={isFavorite ? "currentColor" : "none"}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                {isFavorite ? "Favoritado" : "Favoritar"}
              </button>

              <Link
                href={`/dashboard/${id}/edit`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#8b949e] border border-[#30363d] rounded-lg hover:bg-[#161b22] hover:text-[#e6edf3] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </Link>

              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#f78166] border border-[#f7816633] rounded-lg hover:bg-[#2d0c0c] transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Deletar
              </button>
            </div>
          </div>

          <div className="bg-[#161b22] border border-[#21262d] rounded-xl p-6">
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              {snippetLanguages.map((lang) => (
                <span key={lang} className="text-xs px-2.5 py-1 rounded-full bg-[#1f1d2e] border border-[#d2a8ff44] text-[#d2a8ff]">
                  {lang}
                </span>
              ))}
              <span className="text-xs text-[#484f58] ml-auto">
                {new Date(snippet.updatedAt).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </span>
            </div>

            <h1 className="text-xl font-bold text-[#e6edf3] mb-2">{snippet.title}</h1>

            {snippet.description && (
              <p className="text-sm text-[#8b949e] mb-6">{snippet.description}</p>
            )}

            <div className="mb-4">
              <CodeBlock
                code={snippet.code}
                language={snippetLanguages[0] ?? "text"}
                showCopy={true}
              />
            </div>

            {snippet.tags && snippet.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-4 border-t border-[#21262d]">
                {snippet.tags.map((t) => (
                  <span key={t.tag.id} className="text-xs px-2.5 py-1 rounded-full bg-[#1f1d2e] border border-[#d2a8ff44] text-[#d2a8ff]">
                    {t.tag.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {showDeleteConfirm && (
            <div className="mt-4 bg-[#2d0c0c] border border-[#f7816633] rounded-xl p-4">
              <p className="text-sm text-[#f78166] mb-3">
                Tem certeza que deseja deletar este snippet? Essa ação não pode ser desfeita.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-4 py-1.5 text-sm bg-[#da3633] text-white rounded-lg hover:bg-[#b62324] disabled:opacity-50 transition-colors"
                >
                  {deleting ? "Deletando..." : "Sim, deletar"}
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-1.5 text-sm text-[#8b949e] border border-[#30363d] rounded-lg hover:bg-[#161b22] transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
