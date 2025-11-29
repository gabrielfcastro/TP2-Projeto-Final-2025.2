import { render, screen, fireEvent } from '@testing-library/react';
import LojaFeirantePage from './page';

// Mock do window.confirm para testes
beforeEach(() => {
  window.confirm = jest.fn(() => true);
});

// Teste 1: Verifica se a página renderiza corretamente com o nome do feirante
test('deve renderizar a página do feirante', () => {
  render(<LojaFeirantePage />);
  expect(screen.getByText('Feira do Seu Zé')).toBeInTheDocument();
});

// Teste 2: Verifica se todas as informações do feirante são exibidas corretamente
test('deve exibir informações completas do feirante', () => {
  render(<LojaFeirantePage />);
  
  expect(screen.getByText('Feira do Seu Zé')).toBeInTheDocument();
  expect(screen.getByText('2.5 km de você')).toBeInTheDocument();
  expect(screen.getByText('Produtos frescos direto da roça')).toBeInTheDocument();
  expect(screen.getByText(/Barraca 15/)).toBeInTheDocument();
  expect(screen.getByText(/\(11\) 99999-9999/)).toBeInTheDocument();
});

// Teste 3: Verifica se a lista de produtos é exibida para usuários com botão "Ver Produto"
test('deve exibir lista de produtos para usuários', () => {
  render(<LojaFeirantePage />);
  
  expect(screen.getByText('Tomate Italiano')).toBeInTheDocument();
  expect(screen.getByText('Alface Crespa')).toBeInTheDocument();
  expect(screen.getByText('Cenoura')).toBeInTheDocument();
  expect(screen.getAllByText('Ver Produto')).toHaveLength(3);
});

// Teste 4: Verifica a alternância entre as visões de usuário e feirante
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

// Teste 5: Verifica se o formulário de cadastro é exibido na visão do feirante
test('deve exibir formulário de cadastro na visão feirante', () => {
  render(<LojaFeirantePage />);
  fireEvent.click(screen.getByText('Feirante'));
  
  expect(screen.getByPlaceholderText('Ex: Tomate Italiano')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Ex: Produto fresco colhido hoje')).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Ex: 8.90')).toBeInTheDocument();
  expect(screen.getByDisplayValue('kg')).toBeInTheDocument();
});

// Teste 6: Verifica a funcionalidade de adicionar novo produto como feirante
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

// Teste 7: Verifica a validação do formulário (não permite cadastro sem nome e preço)
test('não deve adicionar produto sem nome e preço', () => {
  render(<LojaFeirantePage />);
  fireEvent.click(screen.getByText('Feirante'));
  
  const quantidadeInicial = screen.getAllByText('Excluir Produto').length;
  
  // Tenta adicionar sem preencher
  fireEvent.click(screen.getByText('+ Adicionar Produto'));
  
  // Quantidade deve permanecer a mesma
  expect(screen.getAllByText('Excluir Produto')).toHaveLength(quantidadeInicial);
});

// Teste 8: Verifica se a confirmação de exclusão é acionada ao tentar excluir produto
test('deve mostrar confirmação ao excluir produto', () => {
  // Mock do window.confirm
  window.confirm = jest.fn(() => true);
  
  render(<LojaFeirantePage />);
  fireEvent.click(screen.getByText('Feirante'));
  
  const botoesExcluir = screen.getAllByText('Excluir Produto');
  fireEvent.click(botoesExcluir[0]);
  
  expect(window.confirm).toHaveBeenCalledWith('Tem certeza que deseja excluir este produto?');
});

// Teste 9: Verifica a exibição da mensagem quando não há produtos cadastrados
test('deve exibir mensagem quando não há produtos', () => {
  render(<LojaFeirantePage />);
  fireEvent.click(screen.getByText('Feirante'));
  
  // Remove todos os produtos
  const botoesExcluir = screen.getAllByText('Excluir Produto');
  
  // Mock do confirm para sempre retornar true
  window.confirm = jest.fn(() => true);
  
  botoesExcluir.forEach(botao => {
    fireEvent.click(botao);
  });
  
  expect(screen.getByText('Nenhum produto disponível')).toBeInTheDocument();
  expect(screen.getByText('Adicione seu primeiro produto!')).toBeInTheDocument();
});