"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditarProdutoPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id; // Pega o ID da URL (ex: 1)

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [loading, setLoading] = useState(true);

  // 1. Carrega os dados atuais do produto
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

  // 2. Salva as alterações (PUT)
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

  if (loading) return <div className="p-10">Carregando dados...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <Link
          href="/produtos"
          className="text-blue-600 hover:underline mb-4 inline-block"
        >
          &larr; Voltar
        </Link>

        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Editar Produto
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md"
        >
          {/* Nome */}
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
              className="w-full border border-gray-300 p-2 rounded text-gray-900"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          {/* Descrição */}
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
              className="w-full border border-gray-300 p-2 rounded text-gray-900"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
          </div>

          {/* Preço */}
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
              className="w-full border border-gray-300 p-2 rounded text-gray-900"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded font-bold hover:bg-blue-700 transition"
          >
            Salvar Alterações
          </button>
        </form>
      </div>
    </main>
  );
}
