"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Email ou senha incorretos");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#e6edf3]">Dev Studio</h1>
          <p className="text-sm text-[#484f58] mt-1">
            Seu segundo cérebro de desenvolvedor
          </p>
        </div>

        <div className="bg-[#161b22] rounded-xl border border-[#21262d] p-6">
          <h2 className="text-lg font-semibold text-[#e6edf3] mb-6">Entrar</h2>

          {error && (
            <div className="bg-[#2d0c0c] border border-[#f7816633] text-[#f78166] text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8b949e] mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#21262d] rounded-lg text-sm text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8b949e] mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#21262d] rounded-lg text-sm text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#484f58] mt-4">
          Não tem conta?{" "}
          <Link href="/register" className="text-[#d2a8ff] hover:underline">
            Criar conta
          </Link>
        </p>
      </div>
    </div>
  );
}
