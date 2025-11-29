"use client";

import { useState } from "react";

export default function LojaFeirantePage() {
  // Estado para simular o tipo de usuário
  const [tipoUsuario, setTipoUsuario] = useState<"usuario" | "feirante">("usuario");

  // Dados fictícios do feirante
  const feirante = {
    nome: "Feira do Seu Zé",
    descricao: "Produtos frescos direto da roça",
    localizacao: "Barraca 15 - Setor de Hortifruti",
    telefone: "(11) 99999-9999",
    distancia: "2.5 km de você"
  };

  // Produtos fictícios
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: "Tomate Italiano",
      descricao: "Tomates frescos colhidos hoje",
      preco: 8.90,
      unidade: "kg"
    },
    {
      id: 2,
      nome: "Alface Crespa",
      descricao: "Alface orgânica e crocante",
      preco: 3.50,
      unidade: "un"
    },
    {
      id: 3,
      nome: "Cenoura",
      descricao: "Cenouras doces e frescas",
      preco: 4.20,
      unidade: "kg"
    }
  ]);

  // Estado para o formulário de novo produto
  const [novoProduto, setNovoProduto] = useState({
    nome: "",
    descricao: "",
    preco: "",
    unidade: "kg"
  });

  // Função para adicionar novo produto (visão do feirante)
  const adicionarProduto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoProduto.nome || !novoProduto.preco) return;

    const produto = {
      id: produtos.length + 1,
      nome: novoProduto.nome,
      descricao: novoProduto.descricao,
      preco: parseFloat(novoProduto.preco),
      unidade: novoProduto.unidade
    };

    setProdutos([...produtos, produto]);
    setNovoProduto({ nome: "", descricao: "", preco: "", unidade: "kg" });
  };

  // Função para excluir produto (visão do feirante)
  const excluirProduto = (id: number) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      setProdutos(produtos.filter(produto => produto.id !== id));
    }
  };

  return (
    <main className="min-h-screen bg-zinc-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Seletor de Tipo de Usuário (apenas para demonstração) */}
        <div className="flex justify-center mb-6">
          <div className="bg-white p-2 rounded-lg shadow-md flex gap-2">
            <button
              onClick={() => setTipoUsuario("usuario")}
              className={`px-4 py-2 rounded-md transition-colors ${
                tipoUsuario === "usuario" 
                  ? "bg-green-600 text-white" 
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Usuário
            </button>
            <button
              onClick={() => setTipoUsuario("feirante")}
              className={`px-4 py-2 rounded-md transition-colors ${
                tipoUsuario === "feirante" 
                  ? "bg-green-600 text-white" 
                  : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
              }`}
            >
              Feirante
            </button>
          </div>
        </div>
        
        {/* Cabeçalho da Loja */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-zinc-200">
          <div className="flex items-center gap-6">
            <div className="bg-green-100 p-4 rounded-full">
              <span className="text-4xl">F</span>
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                <h1 className="text-3xl font-bold text-zinc-900">
                  {feirante.nome}
                </h1>
                <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                  <span>📍</span>
                  {feirante.distancia}
                </div>
              </div>
              
              <p className="text-zinc-600 text-lg mb-3">
                {feirante.descricao}
              </p>
              
              <div className="flex flex-wrap gap-4 text-zinc-500">
                <div className="flex items-center gap-2">
                  Local: {feirante.localizacao}
                </div>
                <div className="flex items-center gap-2">
                  Tel: {feirante.telefone}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* VISÃO DO FEIRANTE - Formulário para adicionar produtos */}
        {tipoUsuario === "feirante" && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-zinc-200">
            <h2 className="text-2xl font-bold text-zinc-900 mb-4">
              Adicionar Novo Produto
            </h2>
            <form onSubmit={adicionarProduto} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Nome do Produto
                </label>
                <input
                  type="text"
                  value={novoProduto.nome}
                  onChange={(e) => setNovoProduto({...novoProduto, nome: e.target.value})}
                  className="w-full p-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-zinc-900"
                  placeholder="Ex: Tomate Italiano"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Descrição
                </label>
                <input
                  type="text"
                  value={novoProduto.descricao}
                  onChange={(e) => setNovoProduto({...novoProduto, descricao: e.target.value})}
                  className="w-full p-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-zinc-900"
                  placeholder="Ex: Produto fresco colhido hoje"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Preço
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={novoProduto.preco}
                  onChange={(e) => setNovoProduto({...novoProduto, preco: e.target.value})}
                  className="w-full p-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-zinc-900"
                  placeholder="Ex: 8.90"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-700 mb-1">
                  Unidade
                </label>
                <select
                  value={novoProduto.unidade}
                  onChange={(e) => setNovoProduto({...novoProduto, unidade: e.target.value})}
                  className="w-full p-3 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-zinc-900"
                >
                  <option value="kg">kg</option>
                  <option value="un">un</option>
                  <option value="cx">cx</option>
                  <option value="l">l</option>
                </select>
              </div>
              
              <div className="md:col-span-2 lg:col-span-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-500 transition-colors font-medium"
                >
                  + Adicionar Produto
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista de Produtos */}
        <div>
          <h2 className="text-2xl font-bold text-zinc-900 mb-6">
            {tipoUsuario === "usuario" ? "Produtos Disponíveis" : "Meus Produtos"}
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.length === 0 ? (
              <div className="col-span-full text-center py-16">
                <div className="text-zinc-400 text-6xl mb-4">🥬</div>
                <h3 className="text-xl font-semibold text-zinc-600 mb-2">
                  Nenhum produto disponível
                </h3>
                <p className="text-zinc-500">
                  {tipoUsuario === "usuario" 
                    ? "Volte em breve para conferir nossos produtos!" 
                    : "Adicione seu primeiro produto!"}
                </p>
              </div>
            ) : (
              produtos.map((produto) => (
                <div
                  key={produto.id}
                  className="bg-white rounded-xl shadow-md border border-zinc-200 p-6 hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="mb-4">
                    <div className="bg-green-50 w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-xl">P</span>
                    </div>
                    
                    <h3 className="text-xl font-semibold text-zinc-900 mb-2">
                      {produto.nome}
                    </h3>
                    
                    <p className="text-zinc-600 text-sm mb-4">
                      {produto.descricao}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-green-600">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                      <span className="text-zinc-500 text-sm bg-zinc-100 px-2 py-1 rounded">
                        /{produto.unidade}
                      </span>
                    </div>
                  </div>

                  {tipoUsuario === "usuario" ? (
                    <button className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition-colors duration-300 font-medium">
                      Ver Produto
                    </button>
                  ) : (
                    <button 
                      onClick={() => excluirProduto(produto.id)}
                      className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-500 transition-colors duration-300 font-medium"
                    >
                      Excluir Produto
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </main>
  );
}