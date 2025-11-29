import { render, screen, fireEvent } from '@testing-library/react';
import LojaFeirantePage from './page';
import '@testing-library/jest-dom'; 

// Mock do window.confirm para testes
beforeEach(() => {
  window.confirm = jest.fn(() => true);
});

// Teste 1: Verifica se a página renderiza
test('deve renderizar a página do feirante', () => {
  render(<LojaFeirantePage />);
  expect(screen.getByText('Feira do Seu Zé')).toBeInTheDocument();
});

// Teste 2: Verifica informações do feirante
test('deve exibir informações completas do feirante', () => {
  render(<LojaFeirantePage />);
  expect(screen.getByText('Feira do Seu Zé')).toBeInTheDocument();
  expect(screen.getByText('2.5 km de você')).toBeInTheDocument();
  expect(screen.getByText('Produtos frescos direto da roça')).toBeInTheDocument();
  expect(screen.getByText(/Barraca 15/)).toBeInTheDocument();
  expect(screen.getByText(/\(11\) 99999-9999/)).toBeInTheDocument();
});

// Teste 3: Verifica lista de produtos
test('deve exibir lista de produtos para usuários', () => {
  render(<LojaFeirantePage />);
  expect(screen.getByText('Tomate Italiano')).toBeInTheDocument();
  expect(screen.getByText('Alface Crespa')).toBeInTheDocument();
  expect(screen.getByText('Cenoura')).toBeInTheDocument();
  expect(screen.getAllByText('Ver Produto')).toHaveLength(3);
});

// Teste 4: Verifica alternância de visões
test('deve alternar entre visão do usuário e feirante', () => {
  render(<LojaFeirantePage />);
  expect(screen.getByText('Produtos Disponíveis')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Feirante'));
  expect(screen.getByText('Meus Produtos')).toBeInTheDocument();
  fireEvent.click(screen.getByText('Usuário'));
  expect(screen.getByText('Produtos Disponíveis')).toBeInTheDocument();
});

// Teste 5: Verifica formulário de cadastro
test('deve exibir formulário de cadastro na visão feirante', () => {
  render(<LojaFeirantePage />);
  fireEvent.click(screen.getByText('Feirante'));
  expect(screen.getByPlaceholderText('Ex: Tomate Italiano')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Ex: Produto fresco colhido hoje')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Ex: 8.90')).toBeInTheDocument();
  expect(screen.getByDisplayValue('kg')).toBeInTheDocument();
});

// Teste 6: Verifica adição de produto
test('deve adicionar novo produto como feirante', () => {
  render(<LojaFeirantePage />);
  fireEvent.click(screen.getByText('Feirante'));
  const nomeInput = screen.getByPlaceholderText('Ex: Tomate Italiano');
  const precoInput = screen.getByPlaceholderText('Ex: 8.90');
  fireEvent.change(nomeInput, { target: { value: 'Maçã Verde' } });
  fireEvent.change(precoInput, { target: { value: '6.75' } });
  fireEvent.click(screen.getByText('+ Adicionar Produto'));
  expect(screen.getByText('Maçã Verde')).toBeInTheDocument();
  expect(screen.getByText('R$ 6.75')).toBeInTheDocument();
});

// Teste 7: Verifica validação do formulário
test('não deve adicionar produto sem nome e preço', () => {
  render(<LojaFeirantePage />);
  fireEvent.click(screen.getByText('Feirante'));
  const quantidadeInicial = screen.getAllByText('Excluir Produto').length;
  fireEvent.click(screen.getByText('+ Adicionar Produto'));
  expect(screen.getAllByText('Excluir Produto')).toHaveLength(quantidadeInicial);
});

// Teste 8: Verifica confirmação de exclusão
test('deve mostrar confirmação ao excluir produto', () => {
  window.confirm = jest.fn(() => true);
  render(<LojaFeirantePage />);
  fireEvent.click(screen.getByText('Feirante'));
  const botoesExcluir = screen.getAllByText('Excluir Produto');
  fireEvent.click(botoesExcluir[0]);
  expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este produto?');
});

// Teste 9: Verifica estado sem produtos
test('deve exibir mensagem quando não há produtos', () => {
  render(<LojaFeirantePage />);
  fireEvent.click(screen.getByText('Feirante'));
  const botoesExcluir = screen.getAllByText('Excluir Produto');
  window.confirm = jest.fn(() => true);
  botoesExcluir.forEach(botao => {
    fireEvent.click(botao);
  });
  expect(screen.getByText('Nenhum produto disponível')).toBeInTheDocument();
});