import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event'; // ✅ Adicione esta importação
import Login from '@/app/login/page';

// Mock do Next.js
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

describe('Login Component - Renderização', () => {
  test('Teste 1: Renderizar o formulário de login inicial', () => {
    render(<Login />);
    
    expect(screen.getByText('iFeiranet')).toBeInTheDocument();
    expect(screen.getByText('Entrar na Plataforma')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ENTRAR' })).toBeInTheDocument();
    expect(screen.getByText('Não tem uma conta? Cadastre-se')).toBeInTheDocument();
  });

  test('Teste 2: Alternar para cadastro quando clicar em Cadastre-se', () => {
    render(<Login />);
    
    const cadastroLink = screen.getByText('Não tem uma conta? Cadastre-se');
    fireEvent.click(cadastroLink);
    
    expect(screen.getByText('Criar Conta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nome completo')).toBeInTheDocument();
  });

  test('Teste 3: Seção de tipo de usuário no cadastro', () => {
    render(<Login />);
    
    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));
    
    expect(screen.getByText('Tipo de Conta:')).toBeInTheDocument();
    expect(screen.getByText('Usuário')).toBeInTheDocument();
    expect(screen.getByText('Feirante')).toBeInTheDocument();
    expect(screen.getByText('Administrador')).toBeInTheDocument();
  });

  test('Teste 4: Mostrar campos específicos para feirante', () => {
    render(<Login />);
    
    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));
    fireEvent.click(screen.getByText('Feirante'));
    
    expect(screen.getByPlaceholderText('Nome da banca')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Localização da banca')).toBeInTheDocument();
  });

  test('Teste 5: Mostrar erro ao tentar login com campos vazios', async () => {
    render(<Login />);
    
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });
  });

  test('Teste 6: Mostrar erro ao tentar cadastro com campos vazios', async () => {
    render(<Login />);
    
    fireEvent.click(screen.getByText('Não tem uma conta? Cadastre-se'));
    const submitButton = screen.getByRole('button', { name: 'CRIAR CONTA' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });
  });

test('Teste 7: Mostrar erro para senha muito curta', async () => {
    const user = userEvent.setup(); 
    render(<Login />);
    
    const passwordInput = screen.getByPlaceholderText('Senha');
    await user.type(passwordInput, '123'); 
    
    const submitButton = screen.getByRole('button', { name: 'ENTRAR' });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Senha deve ter pelo menos 6 caracteres')).toBeInTheDocument();
    });
  });

test('Teste 8: Mostrar estado de loading durante o envio', async () => {
  render(<Login />);
  
  await userEvent.type(screen.getByPlaceholderText('E-mail'), 'teste@example.com');
  await userEvent.type(screen.getByPlaceholderText('Senha'), '123456');
  
  const submitButton = screen.getByRole('button', { name: 'ENTRAR' });
  fireEvent.click(submitButton);
  
  await waitFor(() => {
    expect(screen.getByText('PROCESSANDO...')).toBeInTheDocument();
  });
});

});