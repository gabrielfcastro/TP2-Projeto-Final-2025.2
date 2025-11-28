"use client"

import { useState } from "react"

export default function Login() {
  const [showRegister, setShowRegister] = useState(false)

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
            ENTRAR
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