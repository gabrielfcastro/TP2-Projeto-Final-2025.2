"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

const API_URL = "http://127.0.0.1:5000/api";

export default function FeiranteProdutosPage() {
  const params = useParams();
  const feiranteId = params.id;
  const [feirante, setFeirante] = useState<any>(null);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        // Buscar feirante
        const resFeirante = await fetch(`${API_URL}/feirantes/${feiranteId}`);
        if (resFeirante.ok) {
          const feiranteData = await resFeirante.json();
          setFeirante(feiranteData);
        }

        // Buscar produtos do feirante
        const resProdutos = await fetch(
          `${API_URL}/produtos?feirante_id=${feiranteId}`,
        );
        if (resProdutos.ok) {
          const produtosData = await resProdutos.json();
          setProdutos(Array.isArray(produtosData) ? produtosData : []);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [feiranteId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-zinc-950 p-6 flex items-center justify-center">
        <div className="text-zinc-400">Carregando...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-6xl mx-auto">
        <Link
          href="/feirantes"
          className="text-blue-400 hover:text-blue-300 mb-6 inline-block"
        >
          ← Voltar para Feirantes
        </Link>

        {feirante && (
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {feirante.nome_estabelecimento}
            </h1>
            {feirante.link_wpp && (
              <a
                href={feirante.link_wpp}
                target="_blank"
                rel="noreferrer"
                className="text-green-400 hover:text-green-300"
              >
                Contato via WhatsApp
              </a>
            )}
          </div>
        )}

        <h2 className="text-2xl font-bold text-white mb-6">
          Produtos ({produtos.length})
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {produtos.length === 0 ? (
            <p className="text-zinc-500 col-span-3 text-center">
              Este feirante não possui produtos cadastrados.
            </p>
          ) : (
            produtos.map((prod) => (
              <div
                key={prod.id}
                className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl hover:border-zinc-700 transition duration-300 flex flex-col justify-between shadow-lg"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">
                    {prod.nome}
                  </h3>
                  <p className="text-zinc-400 text-sm mb-4 line-clamp-2 h-10">
                    {prod.descricao}
                  </p>
                  <p className="text-3xl font-bold text-green-400">
                    R$ {Number(prod.preco).toFixed(2)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
