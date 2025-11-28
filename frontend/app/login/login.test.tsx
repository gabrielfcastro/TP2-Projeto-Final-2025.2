import { render, screen } from '@testing-library/react';
import Login from '@/app/login/page';

// Mock do Next.js
jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => children;
});

describe('Login Component - Renderização', () => {
  test('deve renderizar o formulário de login inicial', () => {
    render(<Login />);
    
    expect(screen.getByText('iFeiranet')).toBeInTheDocument();
    expect(screen.getByText('Entrar na Plataforma')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'ENTRAR' })).toBeInTheDocument();
    expect(screen.getByText('Não tem uma conta? Cadastre-se')).toBeInTheDocument();
  });
});