import { render, screen, fireEvent } from '@testing-library/react';
import LojaFeirantePage from './page';

// Mock do window.confirm para testes
beforeEach(() => {
  window.confirm = jest.fn(() => true);
});

test('deve renderizar a página do feirante', () => {
  render(<LojaFeirantePage />);
  expect(screen.getByText('Feira do Seu Zé')).toBeInTheDocument();
});

test('deve exibir informações completas do feirante', () => {
  render(<LojaFeirantePage />);
  
  expect(screen.getByText('Feira do Seu Zé')).toBeInTheDocument();
  expect(screen.getByText('2.5 km de você')).toBeInTheDocument();
  expect(screen.getByText('Produtos frescos direto da roça')).toBeInTheDocument();
  expect(screen.getByText(/Barraca 15/)).toBeInTheDocument();
  expect(screen.getByText(/\(11\) 99999-9999/)).toBeInTheDocument();
});

test('deve exibir lista de produtos para usuários', () => {
  render(<LojaFeirantePage />);
  
  expect(screen.getByText('Tomate Italiano')).toBeInTheDocument();
  expect(screen.getByText('Alface Crespa')).toBeInTheDocument();
  expect(screen.getByText('Cenoura')).toBeInTheDocument();
  expect(screen.getAllByText('Ver Produto')).toHaveLength(3);
});

test('deve alternar entre visão do usuário e feirante', () => {
  render(<LojaFeirantePage />);
  
  // Inicia na visão do usuário
  expect(screen.getByText('Produtos Disponíveis')).toBeInTheDocument();
  
  // Alterna para feirante
  fireEvent.click(screen.getByText('Feirante'));
  expect(screen.getByText('Meus Produtos')).toBeInTheDocument();
  
  // Volta para usuário
  fireEvent.click(screen.getByText('Usuário'));
  expect(screen.getByText('Produtos Disponíveis')).toBeInTheDocument();
});

test('deve exibir formulário de cadastro na visão feirante', () => {
  render(<LojaFeirantePage />);
  fireEvent.click(screen.getByText('Feirante'));
  
  expect(screen.getByPlaceholderText('Ex: Tomate Italiano')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Ex: Produto fresco colhido hoje')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Ex: 8.90')).toBeInTheDocument();
  expect(screen.getByDisplayValue('kg')).toBeInTheDocument();
});

test('deve adicionar novo produto como feirante', () => {
  render(<LojaFeirantePage />);
  fireEvent.click(screen.getByText('Feirante'));
  
  const nomeInput = screen.getByPlaceholderText('Ex: Tomate Italiano');
  const descInput = screen.getByPlaceholderText('Ex: Produto fresco colhido hoje');
  const precoInput = screen.getByPlaceholderText('Ex: 8.90');
  
  fireEvent.change(nomeInput, { target: { value: 'Maçã Verde' } });
  fireEvent.change(descInput, { target: { value: 'Maçãs frescas da serra' } });
  fireEvent.change(precoInput, { target: { value: '6.75' } });
  
  fireEvent.click(screen.getByText('+ Adicionar Produto'));
  
  expect(screen.getByText('Maçã Verde')).toBeInTheDocument();
  expect(screen.getByText('R$ 6.75')).toBeInTheDocument();
});