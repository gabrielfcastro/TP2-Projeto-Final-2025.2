"use client";

import { useState } from "react";

interface Conta {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  localizacao: string;
  tipo: 'usuario' | 'feirante' | 'admin';
  dataCadastro: string;
}

interface FeiranteRelatorio {
  id: number;
  nome: string;
  produtosVendidos: number;
  faturamento: number;
}

interface RelatorioUso {
  buscasRealizadas: number;
  usuariosAtivos: number;
  pedidosRealizados: number;
  locaisPopulares: { local: string; acessos: number }[];
}

export default function RelatoriosPage() {
  // Estado para a lista de contas
  const [contas, setContas] = useState<Conta[]>([
    { 
      id: 1, 
      nome: 'João Silva', 
      email: 'joao@email.com', 
      telefone: '(11) 99999-9999',
      localizacao: 'São Paulo, SP',
      tipo: 'usuario', 
      dataCadastro: '2024-01-15' 
    },
    { 
      id: 2, 
      nome: 'Maria Santos', 
      email: 'maria@email.com', 
      telefone: '(11) 98888-8888',
      localizacao: 'São Paulo, SP',
      tipo: 'feirante', 
      dataCadastro: '2024-01-10' 
    },
    { 
      id: 3, 
      nome: 'Admin Sistema', 
      email: 'admin@sistema.com', 
      telefone: '(11) 97777-7777',
      localizacao: 'São Paulo, SP',
      tipo: 'admin', 
      dataCadastro: '2024-01-01' 
    },
    { 
      id: 4, 
      nome: 'Carlos Oliveira', 
      email: 'carlos@email.com', 
      telefone: '(21) 96666-6666',
      localizacao: 'Rio de Janeiro, RJ',
      tipo: 'feirante', 
      dataCadastro: '2024-01-20' 
    },
  ]);

  // Relatório de feirantes (História 3)
  const [relatorioFeirantes] = useState<FeiranteRelatorio[]>([
    { id: 1, nome: 'Feira do Seu Zé', produtosVendidos: 45, faturamento: 1250.00 },
    { id: 2, nome: 'Hortifruti Fresco', produtosVendidos: 28, faturamento: 890.00 },
    { id: 3, nome: 'Orgânicos da Terra', produtosVendidos: 32, faturamento: 1100.00 },
  ]);

  // Relatório de uso do sistema (História 4)
  const [relatorioUso] = useState<RelatorioUso>({
    buscasRealizadas: 1247,
    usuariosAtivos: 156,
    pedidosRealizados: 89,
    locaisPopulares: [
      { local: 'São Paulo, SP', acessos: 845 },
      { local: 'Rio de Janeiro, RJ', acessos: 432 },
      { local: 'Belo Horizonte, MG', acessos: 287 },
      { local: 'Curitiba, PR', acessos: 198 },
    ]
  });

  // Estado para nova conta
  const [novaConta, setNovaConta] = useState({
    nome: '',
    email: '',
    telefone: '',
    localizacao: '',
    tipo: 'usuario' as 'usuario' | 'feirante' | 'admin'
  });

  // Estado para filtro
  const [filtroTipo, setFiltroTipo] = useState<'todos' | 'usuario' | 'feirante' | 'admin'>('todos');

  // Filtrar contas
  const contasFiltradas = filtroTipo === 'todos' 
    ? contas 
    : contas.filter(conta => conta.tipo === filtroTipo);

  // Função para adicionar conta
  const adicionarConta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaConta.nome || !novaConta.email) return;

    const conta: Conta = {
      id: contas.length + 1,
      nome: novaConta.nome,
      email: novaConta.email,
      telefone: novaConta.telefone,
      localizacao: novaConta.localizacao,
      tipo: novaConta.tipo,
      dataCadastro: new Date().toISOString().split('T')[0]
    };

    setContas([...contas, conta]);
    setNovaConta({ nome: '', email: '', telefone: '', localizacao: '', tipo: 'usuario' });
  };

  // Função para remover conta (História 1)
  const removerConta = (id: number) => {
    if (!confirm('Tem certeza que deseja remover esta conta?')) return;
    setContas(contas.filter(conta => conta.id !== id));
  };

  // Estatísticas
  const totalUsuarios = contas.filter(c => c.tipo === 'usuario').length;
  const totalFeirantes = contas.filter(c => c.tipo === 'feirante').length;
  const totalAdmins = contas.filter(c => c.tipo === 'admin').length;

  return (
    <main className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Relatórios Administrativos
          </h1>
          <p className="text-zinc-400">
            Controle completo do sistema - Usuários, Feirantes e Estatísticas
          </p>
        </div>

        {/* Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white">{totalUsuarios}</div>
            <div className="text-zinc-400">Usuários</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white">{totalFeirantes}</div>
            <div className="text-zinc-400">Feirantes</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white">{totalAdmins}</div>
            <div className="text-zinc-400">Administradores</div>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center">
            <div className="text-2xl font-bold text-white">{relatorioUso.buscasRealizadas}</div>
            <div className="text-zinc-400">Buscas Realizadas</div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Formulário de Adicionar Conta */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Adicionar Nova Conta</h2>
            
            <form onSubmit={adicionarConta} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Nome completo
                </label>
                <input
                  type="text"
                  value={novaConta.nome}
                  onChange={(e) => setNovaConta({...novaConta, nome: e.target.value})}
                  className="w-full p-3 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-white placeholder-zinc-500"
                  placeholder="Nome completo"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  E-mail
                </label>
                <input
                  type="email"
                  value={novaConta.email}
                  onChange={(e) => setNovaConta({...novaConta, email: e.target.value})}
                  className="w-full p-3 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-white placeholder-zinc-500"
                  placeholder="E-mail"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  value={novaConta.telefone}
                  onChange={(e) => setNovaConta({...novaConta, telefone: e.target.value})}
                  className="w-full p-3 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-white placeholder-zinc-500"
                  placeholder="Telefone"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Localização
                </label>
                <input
                  type="text"
                  value={novaConta.localizacao}
                  onChange={(e) => setNovaConta({...novaConta, localizacao: e.target.value})}
                  className="w-full p-3 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-white placeholder-zinc-500"
                  placeholder="Cidade, Estado"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-1">
                  Tipo de conta
                </label>
                <select
                  value={novaConta.tipo}
                  onChange={(e) => setNovaConta({...novaConta, tipo: e.target.value as any})}
                  className="w-full p-3 bg-zinc-800 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none text-white"
                >
                  <option value="usuario">Usuário</option>
                  <option value="feirante">Feirante</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              
              <button
                type="submit"
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-500 transition-colors font-medium"
              >
                Adicionar Conta
              </button>
            </form>
          </div>

          {/* Lista de Contas */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">
                {filtroTipo === 'todos' ? 'Todas as Contas' : 
                 filtroTipo === 'usuario' ? 'Usuários' :
                 filtroTipo === 'feirante' ? 'Feirantes' : 'Administradores'} 
                ({contasFiltradas.length})
              </h2>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value as any)}
                className="p-2 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-white"
              >
                <option value="todos">Todos</option>
                <option value="usuario">Usuários</option>
                <option value="feirante">Feirantes</option>
                <option value="admin">Administradores</option>
              </select>
            </div>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {contasFiltradas.length === 0 ? (
                <p className="text-zinc-400 text-center py-8">Nenhuma conta encontrada</p>
              ) : (
                contasFiltradas.map((conta) => (
                  <div key={conta.id} className="border border-zinc-800 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white">{conta.nome}</h3>
                        <p className="text-zinc-400 text-sm">{conta.email}</p>
                        <p className="text-zinc-400 text-sm">{conta.telefone}</p>
                        <p className="text-zinc-400 text-sm">{conta.localizacao}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                            conta.tipo === 'admin' ? 'bg-purple-900/50 text-purple-400 border border-purple-800/50' :
                            conta.tipo === 'feirante' ? 'bg-green-900/50 text-green-400 border border-green-800/50' :
                            'bg-blue-900/50 text-blue-400 border border-blue-800/50'
                          }`}>
                            {conta.tipo}
                          </span>
                          <span className="text-zinc-400 text-xs">
                            Cadastro: {conta.dataCadastro}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => removerConta(conta.id)}
                        className="text-red-400 border border-red-900/50 px-3 py-1 rounded-lg hover:bg-red-900/50 transition-colors text-sm"
                      >
                        Remover Conta
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Relatórios */}
          <div className="space-y-6">
            {/* Relatório de Feirantes (História 3) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Desempenho dos Feirantes</h2>
              <div className="space-y-3">
                {relatorioFeirantes.map((feirante) => (
                  <div key={feirante.id} className="border border-zinc-800 rounded-lg p-3">
                    <h3 className="font-semibold text-white">{feirante.nome}</h3>
                    <div className="flex justify-between text-sm text-zinc-400">
                      <span>{feirante.produtosVendidos} produtos vendidos</span>
                      <span className="text-green-400">R$ {feirante.faturamento.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relatório de Uso (História 4) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">Uso do Sistema</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Buscas Realizadas</h3>
                  <div className="text-2xl font-bold text-white">{relatorioUso.buscasRealizadas}</div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-white mb-2">Locais Mais Populares</h3>
                  <div className="space-y-2">
                    {relatorioUso.locaisPopulares.map((local, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-zinc-400">{local.local}</span>
                        <span className="text-zinc-400">{local.acessos} acessos</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}