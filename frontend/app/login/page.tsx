"use client"

import { useState } from "react"

export default function Login() {
  const [showRegister, setShowRegister] = useState(false)
  const [userType, setUserType] = useState("")
  const [errors, setErrors] = useState<string[]>([])
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    nome: "",
    nomeBanca: "",
    localizacao: ""
  })

  // FUNÇÃO DE VALIDAÇÃO CORRIGIDA - VERSÃO SIMPLIFICADA
  const validateForm = () => {
    const newErrors: string[] = []
    
    // Validação de email - VERSÃO GARANTIDA
    if (!formData.email.trim()) {
      newErrors.push('Email é obrigatório')
    } else {
      // Regex que DEFINITIVAMENTE rejeita "email-invalido"
      // Um email válido deve ter: texto@texto.texto
      const hasAtSymbol = formData.email.includes('@')
      const hasDotAfterAt = formData.email.split('@')[1]?.includes('.')
      const isValidEmail = hasAtSymbol && hasDotAfterAt
      
      console.log('Email validation DEBUG:', {
        email: formData.email,
        hasAtSymbol,
        hasDotAfterAt,
        isValidEmail
      })
      
      if (!isValidEmail) {
        newErrors.push('Email inválido')
      }
    }
    
    // Validação de senha
    if (!formData.password) {
      newErrors.push('Senha é obrigatória')
    } else if (formData.password.length < 6) {
      newErrors.push('Senha deve ter pelo menos 6 caracteres')
    }
    
    // Validações específicas do cadastro
    if (showRegister) {
      if (!formData.nome.trim()) newErrors.push('Nome é obrigatório')
      if (userType === "vendor") {
        if (!formData.nomeBanca.trim()) newErrors.push('Nome da banca é obrigatório')
        if (!formData.localizacao.trim()) newErrors.push('Localização é obrigatória')
      }
    }
    
    console.log('Erros finais:', newErrors)
    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Submit com email:', formData.email)
    validateForm()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors.length > 0) setErrors([])
  }

  // O RESTANTE DO JSX PERMANECE IGUAL 👇
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

        {errors.length > 0 && (
          <div 
            className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded"
            data-testid="error-messages"
          >
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">{error}</li>
              ))}
            </ul>
          </div>
        )}
      
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
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

          {showRegister && (
            <div>
              <input 
                name="nome"
                value={formData.nome}
                onChange={handleInputChange}
                placeholder="Nome completo" 
                className="w-full h-14 text-lg px-4 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500"
              />
            </div>
          )}
          
          <div>
            <input 
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="E-mail" 
              className="w-full h-14 text-lg px-4 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500"
              type="email"
            />
          </div>

          {showRegister && userType === "vendor" && (
            <>
              <div>
                <input 
                  name="nomeBanca"
                  value={formData.nomeBanca}
                  onChange={handleInputChange}
                  placeholder="Nome da banca" 
                  className="w-full h-14 text-lg px-4 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500"
                />
              </div>
              <div>
                <input 
                  name="localizacao"
                  value={formData.localizacao}
                  onChange={handleInputChange}
                  placeholder="Localização da banca" 
                  className="w-full h-14 text-lg px-4 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500"
                />
              </div>
            </>
          )}

          <div>
            <input 
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              type="password" 
              placeholder="Senha" 
              className="w-full h-14 text-lg px-4 bg-gray-100 rounded border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black placeholder-gray-500"
            />
          </div>

          <button 
            type="submit"
            className="w-full h-14 text-lg font-bold bg-black text-white rounded hover:bg-gray-800 shadow-md transition-colors mt-4"
          >
            {showRegister ? "CRIAR CONTA" : "ENTRAR"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setShowRegister(!showRegister)
              setErrors([])
            }}
            className="text-black font-semibold hover:text-gray-800 underline"
          >
            {showRegister ? "Já tem uma conta? Faça login" : "Não tem uma conta? Cadastre-se"}
          </button>
        </div>
      </div>
    </div>
  )
}