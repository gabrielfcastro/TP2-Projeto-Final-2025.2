import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Login from './page'

// Mock do fetch global para evitar chamadas reais à API
global.fetch = jest.fn()

beforeEach(() => {
  (global.fetch as jest.Mock).mockClear()
})

describe('Login Component', () => {
  test('Test 1: Render login form', () => {
    render(<Login />)

    expect(screen.getByText('iFeiranet')).toBeInTheDocument()
    expect(screen.getByText('Entre na sua conta para continuar')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'ENTRAR' })).toBeInTheDocument()
  })

  test('Test 2: Switch to register form', () => {
    render(<Login />)

    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'))

    expect(screen.getByText('Criar Conta')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Digite seu nome completo')).toBeInTheDocument()
  })

  test('Test 3: User type section in register', () => {
    render(<Login />)

    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'))

    expect(screen.getByText('Tipo de Conta')).toBeInTheDocument()
    expect(screen.getByText('Usuário')).toBeInTheDocument()
    expect(screen.getByText('Feirante')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  test('Test 4: Show vendor-specific fields', () => {
    render(<Login />)

    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'))
    fireEvent.click(screen.getByText('Feirante'))

    expect(screen.getByPlaceholderText('Digite o nome da sua banca')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Ex: Feira da 408 Sul, box 15')).toBeInTheDocument()
  })

  test('Test 5: Validate invalid email', async () => {
    render(<Login />)

    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' })

    fireEvent.change(emailInput, { target: { value: 'email-invalido' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Email inválido')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('Test 6: Validate short password', async () => {
    render(<Login />)

    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' })

    fireEvent.change(emailInput, { target: { value: 'teste@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Senha deve ter pelo menos 6 caracteres')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('Test 7: Show error for short password', async () => {
    render(<Login />)

    const passwordInput = screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' })

    fireEvent.change(passwordInput, { target: { value: '123' } })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText('Senha deve ter pelo menos 6 caracteres')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('Test 8: Show loading state during submission', async () => {
    // Mock successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'mock-token',
        usuario: { id: 1, nome: 'Teste', email: 'teste@example.com', tipo: 'user' }
      })
    })

    render(<Login />)

    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' })

    fireEvent.change(emailInput, { target: { value: 'teste@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)

    // Check if button is in loading state (disabled)
    await waitFor(() => {
      expect(submitButton).toBeDisabled()
    }, { timeout: 2000 })
    
    expect(screen.getByText('ENTRANDO...')).toBeInTheDocument()
  })

  test('Test 9: Valid user registration', async () => {
    // Mock successful registration response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Usuário cadastrado com sucesso',
        usuario: { id: 3, nome: 'Novo Usuário', email: 'novo@email.com', tipo: 'user' }
      })
    })

    render(<Login />)
    
    // Go to registration form
    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'))
    
    // Fill form
    const nameInput = screen.getByPlaceholderText('Digite seu nome completo')
    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')
    const submitButton = screen.getByRole('button', { name: 'CRIAR CONTA' })

    fireEvent.change(nameInput, { target: { value: 'Novo Usuário' } })
    fireEvent.change(emailInput, { target: { value: 'novo@email.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)

    // Verify fetch was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: 'Novo Usuário',
            email: 'novo@email.com',
            senha: '123456',
            tipo: 'user'
          })
        })
      )
    })
  })

  test('Test 10: Valid vendor registration', async () => {
    // Mock successful registration response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Usuário cadastrado com sucesso',
        usuario: { 
          id: 4, 
          nome: 'João Feirante', 
          email: 'joao@feira.com', 
          tipo: 'feirante' 
        }
      })
    })

    render(<Login />)
    
    // Go to registration form
    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'))
    
    // Select vendor type
    fireEvent.click(screen.getByText('Feirante'))
    
    // Fill form
    const nameInput = screen.getByPlaceholderText('Digite seu nome completo')
    const bancaInput = screen.getByPlaceholderText('Digite o nome da sua banca')
    const localizacaoInput = screen.getByPlaceholderText('Ex: Feira da 408 Sul, box 15')
    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')
    const submitButton = screen.getByRole('button', { name: 'CRIAR CONTA' })

    fireEvent.change(nameInput, { target: { value: 'João Feirante' } })
    fireEvent.change(bancaInput, { target: { value: 'Banca do João' } })
    fireEvent.change(localizacaoInput, { target: { value: 'Feira da 408 Sul, box 15' } })
    fireEvent.change(emailInput, { target: { value: 'joao@feira.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)

    // Verify fetch was called with correct data
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/register',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: 'João Feirante',
            email: 'joao@feira.com',
            senha: '123456',
            tipo: 'feirante',
            nomeBanca: 'Banca do João',
            localizacao: 'Feira da 408 Sul, box 15'
          })
        })
      )
    })
  })

  test('Test 11: Validate required fields for vendor', async () => {
    render(<Login />)
    
    // Go to registration form
    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'))
    
    // Select vendor type
    fireEvent.click(screen.getByText('Feirante'))
    
    // Fill only some fields
    const nameInput = screen.getByPlaceholderText('Digite seu nome completo')
    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')
    const submitButton = screen.getByRole('button', { name: 'CRIAR CONTA' })

    fireEvent.change(nameInput, { target: { value: 'João Feirante' } })
    fireEvent.change(emailInput, { target: { value: 'joao@feira.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)

    // Should show error
    await waitFor(() => {
      expect(screen.getByText('Preencha todos os campos do feirante')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  test('Test 12: Successful login', async () => {
    // Mock successful login response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        access_token: 'mock-jwt-token',
        usuario: { id: 1, nome: 'Teste', email: 'teste@example.com', tipo: 'user' }
      })
    })

    // Mock localStorage
    const localStorageMock = {
      setItem: jest.fn(),
      getItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn(),
      length: 0,
      key: jest.fn()
    }
    Object.defineProperty(window, 'localStorage', { value: localStorageMock })

    render(<Login />)

    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' })

    fireEvent.change(emailInput, { target: { value: 'teste@example.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)

    // Verify fetch was called
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:5000/api/login',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: 'teste@example.com',
            senha: '123456'
          })
        })
      )
    })

    // Verify localStorage was called
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith('token', 'mock-jwt-token')
      expect(localStorageMock.setItem).toHaveBeenCalledWith('user', JSON.stringify({
        id: 1,
        nome: 'Teste',
        email: 'teste@example.com',
        tipo: 'user'
      }))
    })
  })

  test('Test 13: Login with invalid credentials', async () => {
    // Mock error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      json: async () => ({ error: 'Credenciais inválidas' })
    })

    render(<Login />)

    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' })

    fireEvent.change(emailInput, { target: { value: 'invalido@email.com' } })
    fireEvent.change(passwordInput, { target: { value: 'senhaerrada' } })
    fireEvent.click(submitButton)

    // Should show error
    await waitFor(() => {
      expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
    }, { timeout: 3000 })
  })

    test('Test 14: Show error when backend is down', async () => {
      // Mock fetch failure
      (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      render(<Login />)

      const emailInput = screen.getByPlaceholderText('seu@email.com')
      const passwordInput = screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')
      const submitButton = screen.getByRole('button', { name: 'ENTRAR' })

      fireEvent.change(emailInput, { target: { value: 'teste@example.com' } })
      fireEvent.change(passwordInput, { target: { value: '123456' } })
      fireEvent.click(submitButton)

      // Should show connection error
      await waitFor(() => {
        expect(screen.getByText('Network error')).toBeInTheDocument() // Alterado aqui
      }, { timeout: 3000 })
    })

  test('Test 15: Clear form after successful registration', async () => {
    // Mock successful registration response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        message: 'Usuário cadastrado com sucesso',
        usuario: { id: 3, nome: 'Novo Usuário', email: 'novo@email.com', tipo: 'user' }
      })
    })

    render(<Login />)
    
    // Go to registration form
    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'))
    
    // Fill form
    const nameInput = screen.getByPlaceholderText('Digite seu nome completo')
    const emailInput = screen.getByPlaceholderText('seu@email.com')
    const passwordInput = screen.getByPlaceholderText('Digite sua senha (mínimo 6 caracteres)')
    const submitButton = screen.getByRole('button', { name: 'CRIAR CONTA' })

    fireEvent.change(nameInput, { target: { value: 'Novo Usuário' } })
    fireEvent.change(emailInput, { target: { value: 'novo@email.com' } })
    fireEvent.change(passwordInput, { target: { value: '123456' } })
    fireEvent.click(submitButton)

    // After successful registration, should return to login form
    // and fields should be cleared
    await waitFor(() => {
      expect(screen.getByText('iFeiranet')).toBeInTheDocument()
      expect(emailInput).toHaveValue('')
      expect(passwordInput).toHaveValue('')
    }, { timeout: 3000 })
  })
})