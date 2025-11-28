"use client"

import { useState } from "react"

export default function Login() {
  const [showRegister, setShowRegister] = useState(false)
  const [userType, setUserType] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nome: "",
    nomeBanca: "",
    localizacao: ""
  })

  return (
    <div className="min-h-screen flex flex-col items-center bg-white p-4 pt-12 relative">    
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-black mb-2">iFeiranet</h1>
        <p className="text-gray-600">Seu sistema de Compras e busca em Feiras</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-lg shadow-lg border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-black mb-8 text-center">
          {showRegister ? "Criar Conta" : "Entrar na Plataforma"}
        </h2>
      
        <form className="flex flex-col gap-6">
          {/* Seção de Seleção de Tipo de Usuário (apenas no cadastro) */}
          {showRegister && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-black mb-3">
                Tipo de Conta:
              </label>
              <div className="grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("user")}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    userType === "user" 
                    ? "border-black bg-black text-white" 
                    : "border-gray-300 bg-white text-black hover:border-gray-400"
                  }`}
                >
                  <div className="font-semibold">Usuário</div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType("vendor")}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    userType === "vendor" 
                    ? "border-black bg-black text-white" 
                    : "border-gray-300 bg-white text-black hover:border-gray-400"
                  }`}
                >
                  <div className="font-semibold">Feirante</div>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType("admin")}
                  className={`p-4 border-2 rounded-lg text-center transition-colors ${
                    userType === "admin" 
                    ? "border-black bg-black text-white" 
                    : "border-gray-300 bg-white text-black hover:border-gray-400"
                  }`}
                >
                  <div className="font-semibold">Administrador</div>
                </button>
              </div>
            </div>
          )}

          {/* Campo Nome Completo - aparece apenas no cadastro */}
          {showRegister && (
            <div>
              <input 
                name="nome"
                value={formData.nome}
                onChange={(e) => setFormData({...formData, nome: e.target.value})}
                placeholder="Nome completo" 
                className="w-full h-14 text-lg px-4 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500"
              />
            </div>
          )}
          
          <div>
            <input 
              placeholder="E-mail" 
              className="w-full h-14 text-lg px-4 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500"
              type="email"
            />
          </div>

          <div>
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full h-14 text-lg px-4 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500"
            />
          </div>

          <button className="w-full h-14 text-lg font-bold bg-black text-white rounded hover:bg-gray-800 shadow-md transition-colors mt-4">
            {showRegister ? "CRIAR CONTA" : "ENTRAR"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowRegister(!showRegister)}
            className="text-black font-semibold hover:text-gray-800 underline"
          >
            {showRegister ? "Já tem uma conta? Faça login" : "Não tem uma conta? Cadastre-se"}
          </button>
        </div>
      </div>
    </div>
  )
}