import { render, screen, fireEvent } from '@testing-library/react';
import RelatoriosPage from './page';
import '@testing-library/jest-dom';

// Mock do window.confirm para testes
beforeEach(() => {
  window.confirm = jest.fn(() => true);
});

// Teste 1: Verifica se a página renderiza
test('deve renderizar a página de relatórios', () => {
  render(<RelatoriosPage />);
  expect(screen.getByText('Relatórios Administrativos')).toBeInTheDocument();
});

// Teste 2: Verifica estatísticas gerais
test('deve exibir estatísticas corretas', () => {
  render(<RelatoriosPage />);
  
  // Verifica se as principais seções estão presentes (usando getAllByText para elementos duplicados)
  expect(screen.getAllByText('Usuários').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Feirantes').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Administradores').length).toBeGreaterThan(0);
  expect(screen.getAllByText('Buscas Realizadas').length).toBeGreaterThan(0);
});

// Teste 3: Verifica lista de contas inicial
test('deve exibir lista inicial de contas', () => {
  render(<RelatoriosPage />);
  expect(screen.getByText('João Silva')).toBeInTheDocument();
  expect(screen.getByText('Maria Santos')).toBeInTheDocument();
  expect(screen.getByText('Admin Sistema')).toBeInTheDocument();
  expect(screen.getByText('Carlos Oliveira')).toBeInTheDocument();
});

// Teste 4: Verifica formulário de adicionar conta
test('deve exibir formulário de adicionar conta', () => {
  render(<RelatoriosPage />);
  expect(screen.getByPlaceholderText('Nome completo')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('E-mail')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Telefone')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Cidade, Estado')).toBeInTheDocument();
  expect(screen.getByText('Adicionar Conta')).toBeInTheDocument();
});

// Teste 5: Verifica adição de nova conta
test('deve adicionar nova conta', () => {
  render(<RelatoriosPage />);
  
  const nomeInput = screen.getByPlaceholderText('Nome completo');
  const emailInput = screen.getByPlaceholderText('E-mail');
  const telefoneInput = screen.getByPlaceholderText('Telefone');
  const localizacaoInput = screen.getByPlaceholderText('Cidade, Estado');
  
  fireEvent.change(nomeInput, { target: { value: 'Novo Usuário' } });
  fireEvent.change(emailInput, { target: { value: 'novo@email.com' } });
  fireEvent.change(telefoneInput, { target: { value: '(11) 95555-5555' } });
  fireEvent.change(localizacaoInput, { target: { value: 'São Paulo, SP' } });
  
  fireEvent.click(screen.getByText('Adicionar Conta'));
  
  expect(screen.getByText('Novo Usuário')).toBeInTheDocument();
  expect(screen.getByText('novo@email.com')).toBeInTheDocument();
});

// Teste 6: Verifica validação do formulário
test('não deve adicionar conta sem nome e email', () => {
  render(<RelatoriosPage />);
  
  const contasIniciais = screen.getAllByText(/Remover Conta/).length;
  fireEvent.click(screen.getByText('Adicionar Conta'));
  
  expect(screen.getAllByText(/Remover Conta/)).toHaveLength(contasIniciais);
});