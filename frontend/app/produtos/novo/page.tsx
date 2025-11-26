"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NovoProdutoPage() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:5000/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feirante_id: 1, // Simulando usuário logado
          nome,
          descricao,
          preco: parseFloat(preco),
        }),
      });

      if (res.ok) {
        router.push("/produtos");
      } else {
        alert("Erro ao salvar produto");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <Link
          href="/produtos"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          &larr; Voltar
        </Link>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Novo Produto</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          {/* Campo Nome (O teste procura pelo Label "Nome do Produto") */}
          <div className="mb-4">
            <label
              htmlFor="nome"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nome do Produto
            </label>
            <input
              id="nome"
              type="text"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          {/* Campo Descrição (O teste procura pelo Label "Descrição") */}
          <div className="mb-4">
            <label
              htmlFor="descricao"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Descrição
            </label>
            <textarea
              id="descricao"
              rows={3}
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {/* Campo Preço (O teste procura pelo Label "Preço") */}
          <div className="mb-6">
            <label
              htmlFor="preco"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Preço (R$)
            </label>
            <input
              id="preco"
              type="number"
              step="0.01"
              className="w-full border border-gray-300 p-2 rounded focus:ring-2 focus:ring-blue-500 outline-none text-gray-900"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>

          {/* Botão Salvar */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition"
          >
            Salvar
          </button>
        </form>
      </div>
    </main>
  );
}
