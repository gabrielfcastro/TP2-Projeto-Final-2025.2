"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditarProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id;

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [loading, setLoading] = useState(true);

  // Carrega os dados atuais
  useEffect(() => {
    async function carregarProduto() {
      if (!id) return;
      try {
        const res = await fetch(`http://127.0.0.1:5000/api/produtos/${id}`);
        if (res.ok) {
          const dados = await res.json();
          setNome(dados.nome);
          setDescricao(dados.descricao);
          setPreco(dados.preco);
        } else {
          alert("Produto não encontrado");
          router.push("/produtos");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    carregarProduto();
  }, [id, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await fetch(`http://127.0.0.1:5000/api/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome,
        descricao,
        preco: parseFloat(preco),
      }),
    });

    router.push("/produtos");
  };

  // Loading com estilo Dark
  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <p className="text-zinc-400 animate-pulse text-lg">
          Carregando dados do produto...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100">
      <div className="w-full max-w-lg">
        {/* Link Voltar */}
        <Link
          href="/produtos"
          className="flex items-center text-zinc-400 hover:text-blue-500 mb-6 transition-colors text-sm font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-4 h-4 mr-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
            />
          </svg>
          Cancelar e Voltar
        </Link>

        <h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
          Editar Produto
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-2xl relative overflow-hidden"
        >
          {/* Detalhe visual no topo (borda azul) */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-cyan-500"></div>

          {/* Nome */}
          <div className="mb-6">
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-zinc-400 mb-2"
            >
              Nome do Produto
            </label>
            <input
              id="nome"
              type="text"
              className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-zinc-600 transition-all"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          {/* Descrição */}
          <div className="mb-6">
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-zinc-400 mb-2"
            >
              Descrição
            </label>
            <textarea
              id="descricao"
              rows={3}
              className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-zinc-600 transition-all resize-none"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {/* Preço */}
          <div className="mb-8">
            <label
              htmlFor="preco"
              className="block text-sm font-medium text-zinc-400 mb-2"
            >
              Preço (R$)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-zinc-500">R$</span>
              <input
                id="preco"
                type="number"
                step="0.01"
                className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-zinc-600 transition-all"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Botão Salvar (Azul) */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-4 rounded-lg font-bold hover:bg-blue-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-blue-500/20"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </main>
  );
}
