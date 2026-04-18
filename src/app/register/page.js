"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await res.json();

    setLoading(false);

    if (!res.ok) {
      setError(data.error);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1117]">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-2">
            <Logo size="default" />
          </div>
          <p className="text-sm text-[#484f58]">
            Crie sua conta
          </p>
        </div>

        <div className="bg-[#161b22] rounded-xl border border-[#21262d] p-6">
          <h2 className="text-lg font-semibold text-[#e6edf3] mb-6">Cadastro</h2>

          {error && (
            <div className="bg-[#2d0c0c] border border-[#f7816633] text-[#f78166] text-sm px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#8b949e] mb-1">
                Nome
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#21262d] rounded-lg text-sm text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent"
              />
            </div>

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
                minLength={6}
                className="w-full px-3 py-2 bg-[#0d1117] border border-[#21262d] rounded-lg text-sm text-[#e6edf3] focus:outline-none focus:ring-2 focus:ring-[#d2a8ff] focus:border-transparent"
              />
              <p className="text-xs text-[#484f58] mt-1">Mínimo 6 caracteres</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Criando..." : "Criar conta"}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#484f58] mt-4">
          Já tem conta?{" "}
          <Link href="/login" className="text-[#d2a8ff] hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
