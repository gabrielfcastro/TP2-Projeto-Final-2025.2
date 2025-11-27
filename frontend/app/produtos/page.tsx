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

  // Carrega os produtos assim que a tela abre
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
    if (!confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
      // 1. Chama o Backend para deletar
      await fetch(`http://127.0.0.1:5000/api/produtos/${id}`, {
        method: "DELETE",
      });

      // 2. Atualiza a tela removendo o item da lista visualmente
      setProdutos((listaAtual) => listaAtual.filter((prod) => prod.id !== id));
    } catch (error) {
      console.error("Erro ao excluir", error);
    }
  };

  return (
    <main className="container mx-auto p-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Lista de Produtos</h1>

        {/* Botão Criar Novo */}
        <Link
          href="/produtos/novo"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-medium"
        >
          + Novo Produto
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {produtos.length === 0 ? (
          <p className="text-gray-500 col-span-3 text-center">
            Nenhum produto cadastrado.
          </p>
        ) : (
          produtos.map((prod) => (
            <div
              key={prod.id}
              className="border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between"
            >
              {/* Informações do Produto */}
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-800">{prod.nome}</h2>
                <p className="text-gray-600 text-sm mt-1 mb-3">
                  {prod.descricao}
                </p>
                <p className="text-2xl font-bold text-green-600">
                  R$ {prod.preco.toFixed(2)}
                </p>
              </div>

              {/* Botões de Ação (Editar e Excluir) */}
              <div className="flex gap-2 pt-4 border-t border-gray-100">
                <Link
                  href={`/produtos/${prod.id}`}
                  className="flex-1 bg-blue-500 text-white py-2 px-3 rounded text-center hover:bg-blue-600 transition text-sm font-medium"
                >
                  Editar
                </Link>

                <button
                  onClick={() => handleDelete(prod.id)}
                  className="flex-1 bg-red-500 text-white py-2 px-3 rounded hover:bg-red-600 transition text-sm font-medium"
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
