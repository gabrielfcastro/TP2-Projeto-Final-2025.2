"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
}

export default function ProdutosPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);

  useEffect(() => {
    async function carregarDados() {
      try {
        const res = await fetch("http://127.0.0.1:5000/api/produtos");
        const dados = await res.json();
        setProdutos(dados);
      } catch (error) {
        console.error("Erro ao buscar produtos", error);
      }
    }
    carregarDados();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir?")) return;
    try {
      await fetch(`http://127.0.0.1:5000/api/produtos/${id}`, {
        method: "DELETE",
      });
      setProdutos((listaAtual) => listaAtual.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error("Erro ao excluir", error);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 p-10 text-zinc-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10 border-b border-zinc-800 pb-6">
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Meus Produtos
          </h1>

          <Link
            href="/produtos/novo"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition font-bold shadow-lg shadow-green-900/20"
          >
            + Novo Produto
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {produtos.length === 0 ? (
            <p className="text-zinc-500 col-span-3 text-center text-lg">
              Nenhum produto cadastrado ainda.
            </p>
          ) : (
            produtos.map((prod) => (
              <div
                key={prod.id}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition duration-300 flex flex-col justify-between shadow-lg"
              >
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-white mb-2">
                    {prod.nome}
                  </h2>
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-2 h-10">
                    {prod.descricao}
                  </p>
                  <p className="text-3xl font-bold text-green-400">
                    R$ {prod.preco.toFixed(2)}
                  </p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-800">
                  <Link
                    href={`/produtos/${prod.id}`}
                    className="flex-1 bg-zinc-800 text-zinc-300 py-2 px-4 rounded hover:bg-zinc-700 hover:text-white transition text-center text-sm font-medium"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => handleDelete(prod.id)}
                    className="flex-1 bg-red-900/30 text-red-400 py-2 px-4 rounded hover:bg-red-900/50 hover:text-red-300 transition text-sm font-medium border border-red-900/50"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
