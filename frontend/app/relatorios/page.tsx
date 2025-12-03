"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const API_URL = "http://127.0.0.1:5000/api";

export default function RelatoriosPage() {
  const router = useRouter();
  const [usuarios, setUsuarios] = useState<any[]>([]);
  const [feirantes, setFeirantes] = useState<any[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState("");
  const [usuarioLogado, setUsuarioLogado] = useState<string>("");
  const [usuariosEscondidos, setUsuariosEscondidos] = useState<number[]>([]);

  useEffect(() => {
    const user = localStorage.getItem("feiranet_usuario");
    if (!user) {
      router.push("/login");
      return;
    }

    const userData = JSON.parse(user);
    setUsuarioLogado(userData.email);
    carregarDados();
  }, []);

  const handleDeletarUsuario = (id: number) => {
    setUsuariosEscondidos([...usuariosEscondidos, id]);
  };

  const carregarDados = async () => {
    try {
      // Usuários
      const resUsuarios = await fetch(`${API_URL}/usuarios`);
      console.log("Resposta usuários status:", resUsuarios.status);
      if (resUsuarios.ok) {
        const dados = await resUsuarios.json();
        setUsuarios(dados);
        console.log("✓ Usuários carregados:", dados);
      } else {
        console.error(
          "Erro ao buscar usuários:",
          resUsuarios.status,
          await resUsuarios.text(),
        );
      }

      // Feirantes
      const resFeirantes = await fetch(`${API_URL}/feirantes`);
      console.log("Resposta feirantes status:", resFeirantes.status);
      if (resFeirantes.ok) {
        const dados = await resFeirantes.json();
        setFeirantes(dados);
        console.log("✓ Feirantes carregados:", dados);
      } else {
        console.error("Erro ao buscar feirantes:", resFeirantes.status);
      }

      // Produtos
      const resProdutos = await fetch(`${API_URL}/produtos`);
      console.log("Resposta produtos status:", resProdutos.status);
      if (resProdutos.ok) {
        const dados = await resProdutos.json();
        setProdutos(dados);
        console.log("✓ Produtos carregados:", dados);
      } else {
        console.error("Erro ao buscar produtos:", resProdutos.status);
      }

      setLoading(false);
    } catch (e) {
      console.error("✗ Erro:", e);
      setErro(String(e));
      setLoading(false);
    }
  };

  const totalProdutos = produtos.length;
  const totalFeirantes = feirantes.length;

  return (
    <main className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-white">Relatórios</h1>
              <p className="text-zinc-400">
                Dados em tempo real do banco de dados
              </p>
            </div>
            <div className="text-right text-sm">
              <p className="text-zinc-400">Logado como:</p>
              <p className="text-green-400 font-semibold">{usuarioLogado}</p>
            </div>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">
              {usuarios.length}
            </div>
            <div className="text-zinc-400">Usuários</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">
              {totalFeirantes}
            </div>
            <div className="text-zinc-400">Feirantes</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-white">{totalProdutos}</div>
            <div className="text-zinc-400">Produtos</div>
          </div>
        </div>

        {/* Conteúdo */}
        {loading ? (
          <div className="text-center text-zinc-400 py-20">
            Carregando dados...
          </div>
        ) : erro ? (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-red-400">
            <p>Erro ao conectar: {erro}</p>
            <p className="text-sm mt-2">
              Verifique se o backend está rodando em http://127.0.0.1:5000
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
            >
              Tentar novamente
            </button>
          </div>
        ) : usuarios.length === 0 &&
          feirantes.length === 0 &&
          produtos.length === 0 ? (
          <div className="text-center text-zinc-400 py-20">
            Nenhum dado disponível
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Usuários */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Usuários ({usuarios.length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {usuarios.length === 0 ? (
                  <p className="text-zinc-400">Nenhum usuário cadastrado</p>
                ) : (
                  usuarios
                    .filter((u: any) => !usuariosEscondidos.includes(u.id))
                    .map((u: any) => (
                      <div
                        key={u.id}
                        className="border border-zinc-700 rounded p-3"
                      >
                        <p className="text-white font-semibold">{u.nome}</p>
                        <p className="text-zinc-400 text-sm">{u.email}</p>
                        <span
                          className={`inline-block mt-2 px-2 py-1 text-xs rounded ${
                            u.tipo_usuario.toLowerCase() === "admin"
                              ? "bg-purple-900/50 text-purple-400"
                              : u.tipo_usuario.toLowerCase() === "feirante"
                                ? "bg-green-900/50 text-green-400"
                                : "bg-blue-900/50 text-blue-400"
                          }`}
                        >
                          {u.tipo_usuario}
                        </span>
                        <button
                          onClick={() => handleDeletarUsuario(u.id)}
                          className="mt-2 ml-2 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Deletar
                        </button>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Feirantes */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">
                Feirantes ({totalFeirantes})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {feirantes.length === 0 ? (
                  <p className="text-zinc-400">Nenhum feirante cadastrado</p>
                ) : (
                  feirantes.map((f: any) => (
                    <div
                      key={f.id}
                      className="border border-zinc-700 rounded p-3"
                    >
                      <p className="text-white font-semibold">
                        {f.nome_estabelecimento}
                      </p>
                      <p className="text-zinc-400 text-sm">
                        WhatsApp: {f.link_wpp}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Produtos */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 lg:col-span-2">
              <h2 className="text-xl font-bold text-white mb-4">
                Produtos ({totalProdutos})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {produtos.length === 0 ? (
                  <p className="text-zinc-400">Nenhum produto cadastrado</p>
                ) : (
                  produtos.map((p: any) => (
                    <div
                      key={p.id}
                      className="border border-zinc-700 rounded p-3"
                    >
                      <p className="text-white font-semibold">{p.nome}</p>
                      <p className="text-green-400">
                        R$ {p.preco ? parseFloat(p.preco).toFixed(2) : "0.00"}
                      </p>
                      <p className="text-zinc-400 text-xs mt-1">
                        {p.descricao}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
