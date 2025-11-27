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

  // Busca os produtos assim que a tela abre
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

  // Função para excluir o produto
  const handleDelete = async (id: number) => {
    // 1. Chama o Backend para deletar
    await fetch(`http://127.0.0.1:5000/api/produtos/${id}`, {
      method: "DELETE",
    });

    // 2. Atualiza a tela removendo o item da lista visualmente
    setProdutos((listaAtual) => listaAtual.filter((prod) => prod.id !== id));
  };

  return (
    <main className="container mx-auto p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Produtos</h1>

        <Link
          href="/produtos/novo"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
        >
          + Novo Produto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {produtos.length === 0 ? (
          <p className="text-gray-500">Nenhum produto cadastrado.</p>
        ) : (
          produtos.map((prod) => (
            <div
              key={prod.id}
              className="border p-6 rounded-lg shadow hover:shadow-lg transition bg-white text-gray-800 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-xl font-semibold">{prod.nome}</h2>
                <p className="text-gray-500 text-sm mb-2">{prod.descricao}</p>
                <p className="text-2xl font-bold text-green-600 mb-4">
                  R$ {prod.preco.toFixed(2)}
                </p>
              </div>

              <button
                onClick={() => handleDelete(prod.id)}
                className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 transition self-start text-sm mt-2"
              >
                Excluir
              </button>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
