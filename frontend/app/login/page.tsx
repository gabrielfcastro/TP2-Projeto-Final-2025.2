"use client"

import { useState } from "react"
import { UserType, FormData } from './components/types/user'
import { useFormValidation } from './components/hooks/useFormValidation'

export default function Login() {
  const [showRegister, setShowRegister] = useState(false)
  const [userType, setUserType] = useState<UserType>("user")
  const [errors, setErrors] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "", password: "", nome: "", nomeBanca: "", localizacao: ""
  })

  const { validateForm } = useFormValidation()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const validationErrors = validateForm(formData, showRegister, userType)
    
    if (validationErrors.length > 0) {
      setErrors(validationErrors)
      setIsLoading(false)
      return
    }

    setErrors([])

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (showRegister) {
        console.log("Cadastro:", { ...formData, userType })
        alert(`Cadastro realizado como ${userType === 'vendor' ? 'Feirante' : 'Usuário'}!`)
        setShowRegister(false)
      } else {
        console.log("Login:", formData)
        alert("Login realizado com sucesso!")
      }
    } catch (error) {
      setErrors(['Erro ao processar solicitação'])
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors.length > 0) setErrors([])
  }

  const resetForm = () => {
    setShowRegister(!showRegister)
    setErrors([])
    setUserType("user")
    setFormData({ email: "", password: "", nome: "", nomeBanca: "", localizacao: "" })
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Card Principal */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              {showRegister ? 'Criar Conta' : 'iFeiranet'}
            </h1>
            <p className="text-zinc-400">
              {showRegister ? 'Preencha seus dados para começar' : 'Entre na sua conta para continuar'}
            </p>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Campos de Cadastro */}
            {showRegister && (
              <>
                {/* Nome Completo */}
                <div>
                  <label className="block text-zinc-400 text-sm font-medium mb-2">
                    Nome completo
                  </label>
                  <input
                    type="text"
                    name="nome"
                    placeholder="Digite seu nome completo"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                  />
                </div>

                {/* Tipo de Conta */}
                <div>
                  <label className="block text-zinc-400 text-sm font-medium mb-3">
                    Tipo de Conta
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { value: 'user', label: 'Usuário' },
                      { value: 'vendor', label: 'Feirante' },
                      { value: 'admin', label: 'Admin' }
                    ].map((type) => (
                      <button
                        key={type.value}
                        type="button"
                        onClick={() => setUserType(type.value as UserType)}
                        className={`py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                          userType === type.value
                            ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                            : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                        }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Campos específicos para Feirante */}
                {userType === 'vendor' && (
                  <div className="space-y-4 p-4 bg-zinc-800/50 rounded-lg border border-zinc-700">
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">
                        Nome da banca
                      </label>
                      <input
                        type="text"
                        name="nomeBanca"
                        placeholder="Digite o nome da sua banca"
                        value={formData.nomeBanca}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-zinc-400 text-sm font-medium mb-2">
                        Localização da banca
                      </label>
                      <input
                        type="text"
                        name="localizacao"
                        placeholder="Digite a localização da banca"
                        value={formData.localizacao}
                        onChange={handleInputChange}
                        className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Email */}
            <div>
              <label className="block text-zinc-400 text-sm font-medium mb-2">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>

            {/* Senha */}
            <div>
              <label className="block text-zinc-400 text-sm font-medium mb-2">
                Senha
              </label>
              <input
                type="password"
                name="password"
                placeholder="Digite sua senha"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-zinc-800 text-white placeholder-zinc-500 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
              />
            </div>

            {/* Botão Principal */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-500 disabled:bg-zinc-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  PROCESSANDO...
                </>
              ) : (
                showRegister ? 'CRIAR CONTA' : 'ENTRAR'
              )}
            </button>
          </form>

          {/* Alternar entre Login e Cadastro */}
          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={resetForm}
              className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200"
            >
              {showRegister ? 'Já tem uma conta? Faça login' : 'Não tem uma conta? Cadastre-se'}
            </button>
          </div>

          {/* Mensagens de Erro */}
          {errors.length > 0 && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800/50 rounded-lg">
              <div className="space-y-2">
                {errors.map((error, index) => (
                  <p key={index} className="text-red-400 text-sm flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {error}
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-zinc-600 text-sm">
            © 2025 iFeiranet - Plataforma de Feiras
          </p>
        </div>
      </div>
    </div>
  )
}