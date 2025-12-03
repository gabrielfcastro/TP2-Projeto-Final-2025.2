"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Feirante = {
  id: number;
  nome_estabelecimento: string;
  link_wpp: string;
  usuario_id?: number;
};

export default function FeirantesPage() {
  const router = useRouter();
  const [feirantes, setFeirantes] = useState<Feirante[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFeirante, setIsFeirante] = useState(false);
  const [usuarioLogado, setUsuarioLogado] = useState<string>("");

  const [nome, setNome] = useState("");
  const [link, setLink] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const API = "http://127.0.0.1:5000/api/feirantes/";

  useEffect(() => {
    const user = localStorage.getItem("feiranet_usuario");
    if (user) {
      const userData = JSON.parse(user);
      setUsuarioLogado(userData.email);
      setIsFeirante(userData.tipo === "Feirante");
    }
  }, []);

  const getToken = () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("token");
  };

  const fetchFeirantes = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(API);
      if (!res.ok) throw new Error(`Falha ao buscar feirantes: ${res.status}`);
      const data = await res.json();
      setFeirantes(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeirantes();
  }, []);

  const criarFeirante = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const token = getToken();
    if (!token)
      return alert("Para criar um feirante é necessário estar autenticado.");
    if (!nome || !link) return alert("Preencha nome e link do WhatsApp.");

    setSubmitting(true);
    try {
      const res = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome_estabelecimento: nome, link_wpp: link }),
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Erro ao criar: ${res.status} ${txt}`);
      }

      const created = await res.json();
      setFeirantes((prev) => [created, ...prev]);
      setNome("");
      setLink("");
    } catch (err: any) {
      alert(err.message || String(err));
    } finally {
      setSubmitting(false);
    }
  };

  const deletarFeirante = async (id: number) => {
    const token = getToken();
    if (!token)
      return alert("Para deletar um feirante é necessário estar autenticado.");
    if (!confirm("Confirma exclusão deste feirante?")) return;

    try {
      const res = await fetch(`${API}${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 404) {
        alert("Feirante não encontrado (já removido).");
        setFeirantes((p) => p.filter((f) => f.id !== id));
        return;
      }

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(`Erro ao deletar: ${res.status} ${txt}`);
      }

      setFeirantes((p) => p.filter((f) => f.id !== id));
    } catch (err: any) {
      alert(err.message || String(err));
    }
  };

  const isAuthenticated = !!getToken();

  return (
    <main className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Feirantes</h1>
          <div className="text-zinc-400 text-sm">
            <p>
              Logado como:{" "}
              <span className="text-green-400">{usuarioLogado}</span>
            </p>
          </div>
        </div>

        {/* Formulário simples para criar feirante (requer token no localStorage) */}
        {isFeirante && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">
              Cadastrar Feirante
            </h2>
            {!isAuthenticated && (
              <div className="text-zinc-400 text-sm mb-3">
                Você não está autenticado — faça login para criar ou deletar
                feirantes.
              </div>
            )}

            <form
              onSubmit={criarFeirante}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome do estabelecimento"
                className="p-2 bg-zinc-800 text-white rounded"
              />
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="Link WhatsApp (https://wa.me/...)"
                className="p-2 bg-zinc-800 text-white rounded"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={!isAuthenticated || submitting}
                  className="px-4 py-2 bg-green-600 text-white rounded disabled:opacity-60"
                >
                  {submitting ? "Salvando..." : "Criar"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setNome("");
                    setLink("");
                  }}
                  className="px-4 py-2 bg-zinc-800 text-white rounded"
                >
                  Limpar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Listagem */}
        <div>
          {loading ? (
            <div className="text-zinc-400">Carregando feirantes...</div>
          ) : error ? (
            <div className="text-red-400">Erro: {error}</div>
          ) : feirantes.length === 0 ? (
            <div className="text-zinc-400">Nenhum feirante encontrado.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {feirantes.map((f) => (
                <div
                  key={f.id}
                  className="bg-zinc-900 border border-zinc-800 p-4 rounded"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <Link href={`/feirantes/${f.id}`}>
                        <h3 className="text-lg font-semibold text-white hover:text-blue-400 cursor-pointer transition">
                          {f.nome_estabelecimento}
                        </h3>
                      </Link>
                      <p className="text-zinc-400 text-sm mt-1">
                        {f.link_wpp && (
                          <a
                            href={f.link_wpp}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-400 underline"
                          >
                            Abrir WhatsApp
                          </a>
                        )}
                      </p>
                    </div>
                    {isFeirante && (
                      <button
                        onClick={() => deletarFeirante(f.id)}
                        className="text-red-400 border border-red-900/50 px-3 py-1 rounded"
                      >
                        Deletar
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
