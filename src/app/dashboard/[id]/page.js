"use client";

import { useState, useEffect, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import CodeBlock from "@/components/CodeBlock";

export default function SnippetPage({ params }) {
  const { id } = use(params);
  const { status } = useSession();
  const router = useRouter();
  const [snippet, setSnippet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchSnippet();
    }
  }, [status, id]);

  async function fetchSnippet() {
    setLoading(true);
    try {
      const res = await fetch(`/api/snippets/${id}`);
      if (res.ok) {
        const data = await res.json();
        setSnippet(data);
      } else {
        setError("Snippet não encontrado");
      }
    } catch (err) {
      setError("Erro ao carregar snippet");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const res = await fetch(`/api/snippets/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/dashboard");
      } else {
        setError("Erro ao deletar snippet");
      }
    } catch (err) {
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

  return (
    <div className="min-h-screen bg-[#0d1117]">
      <div className="max-w-3xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-[#8b949e] hover:text-[#d2a8ff] transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Voltar
          </Link>

          <div className="flex items-center gap-2">
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
            {snippet.language.split(",").map((lang) => {
              const trimmed = lang.trim();
              return (
                <span
                  key={trimmed}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#1f1d2e] border border-[#d2a8ff44] text-[#d2a8ff]"
                >
                  {trimmed}
                </span>
              );
            })}
            <span className="text-xs text-[#484f58] ml-auto">
              {new Date(snippet.updatedAt).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="text-xl font-bold text-[#e6edf3] mb-2">
            {snippet.title}
          </h1>

          {snippet.description && (
            <p className="text-sm text-[#8b949e] mb-6">
              {snippet.description}
            </p>
          )}

          <div className="mb-4">
            <CodeBlock
              code={snippet.code}
              language={snippet.language.split(",")[0].trim()}
              showCopy={true}
            />
          </div>

          {snippet.tags && snippet.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-4 border-t border-[#21262d]">
              {snippet.tags.map((t) => (
                <span
                  key={t.tag.id}
                  className="text-xs px-2.5 py-1 rounded-full bg-[#1f1d2e] border border-[#d2a8ff44] text-[#d2a8ff]"
                >
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
    </div>
  );
}
