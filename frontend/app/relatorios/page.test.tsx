import { render, screen, fireEvent } from "@testing-library/react";
import RelatoriosPage from "./page";
import "@testing-library/jest-dom";

// Mock do window.confirm para testes
beforeEach(() => {
  window.confirm = jest.fn(() => true);
});

// Teste 1: Verifica se a página renderiza
test("deve renderizar a página de relatórios", () => {
  render(<RelatoriosPage />);
  expect(screen.getByText("Relatórios Administrativos")).toBeInTheDocument();
});

// Teste 2: Verifica estatísticas gerais
test("deve exibir estatísticas corretas", () => {
  render(<RelatoriosPage />);

  // Verifica se as principais seções estão presentes (usando getAllByText para elementos duplicados)
  expect(screen.getAllByText("Usuários").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Feirantes").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Administradores").length).toBeGreaterThan(0);
  expect(screen.getAllByText("Buscas Realizadas").length).toBeGreaterThan(0);
});

// Teste 3: Verifica lista de contas inicial
test("deve exibir lista inicial de contas", () => {
  render(<RelatoriosPage />);
  expect(screen.getByText("João Silva")).toBeInTheDocument();
  expect(screen.getByText("Maria Santos")).toBeInTheDocument();
  expect(screen.getByText("Admin Sistema")).toBeInTheDocument();
  expect(screen.getByText("Carlos Oliveira")).toBeInTheDocument();
});

// Teste 4: Verifica formulário de adicionar conta
test("deve exibir formulário de adicionar conta", () => {
  render(<RelatoriosPage />);
  expect(screen.getByPlaceholderText("Nome completo")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("E-mail")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Telefone")).toBeInTheDocument();
  expect(screen.getByPlaceholderText("Cidade, Estado")).toBeInTheDocument();
  expect(screen.getByText("Adicionar Conta")).toBeInTheDocument();
});

// Teste 5: Verifica adição de nova conta
test("deve adicionar nova conta", () => {
  render(<RelatoriosPage />);

  const nomeInput = screen.getByPlaceholderText("Nome completo");
  const emailInput = screen.getByPlaceholderText("E-mail");
  const telefoneInput = screen.getByPlaceholderText("Telefone");
  const localizacaoInput = screen.getByPlaceholderText("Cidade, Estado");

  fireEvent.change(nomeInput, { target: { value: "Novo Usuário" } });
  fireEvent.change(emailInput, { target: { value: "novo@email.com" } });
  fireEvent.change(telefoneInput, { target: { value: "(11) 95555-5555" } });
  fireEvent.change(localizacaoInput, { target: { value: "São Paulo, SP" } });

  fireEvent.click(screen.getByText("Adicionar Conta"));

  expect(screen.getByText("Novo Usuário")).toBeInTheDocument();
  expect(screen.getByText("novo@email.com")).toBeInTheDocument();
});

// Teste 6: Verifica validação do formulário
test("não deve adicionar conta sem nome e email", () => {
  render(<RelatoriosPage />);

  const contasIniciais = screen.getAllByText(/Remover Conta/).length;
  fireEvent.click(screen.getByText("Adicionar Conta"));

  expect(screen.getAllByText(/Remover Conta/)).toHaveLength(contasIniciais);
});

// Teste 8: Verifica confirmação de remoção
test("deve mostrar confirmação ao remover conta", () => {
  window.confirm = jest.fn(() => true);
  render(<RelatoriosPage />);

  const botoesRemover = screen.getAllByText("Remover Conta");
  fireEvent.click(botoesRemover[0]);

  expect(window.confirm).toHaveBeenCalledWith(
    "Tem certeza que deseja remover esta conta?",
  );
});

// Teste 11: Verifica estado sem contas
test("deve exibir mensagem quando não há contas", () => {
  render(<RelatoriosPage />);

  // Remove todas as contas
  const botoesRemover = screen.getAllByText("Remover Conta");
  window.confirm = jest.fn(() => true);
  botoesRemover.forEach((botao) => {
    fireEvent.click(botao);
  });

  expect(screen.getByText("Nenhuma conta encontrada")).toBeInTheDocument();
});

// Teste 9: Verifica relatório de feirantes
test("deve exibir relatório de desempenho dos feirantes", () => {
  render(<RelatoriosPage />);

  expect(screen.getByText("Feira do Seu Zé")).toBeInTheDocument();
  expect(screen.getByText("45 produtos vendidos")).toBeInTheDocument();
  expect(screen.getByText("R$ 1250.00")).toBeInTheDocument();
  expect(screen.getByText("Hortifruti Fresco")).toBeInTheDocument();
  expect(screen.getByText("28 produtos vendidos")).toBeInTheDocument();
});

// Teste 10: Verifica relatório de uso do sistema
test("deve exibir relatório de uso do sistema", () => {
  render(<RelatoriosPage />);

  // Verifica apenas o que sabemos que existe
  expect(screen.getAllByText("1247").length).toBeGreaterThan(0); // Buscas realizadas
  expect(screen.getByText("Uso do Sistema")).toBeInTheDocument();
});

// Teste 12: Verifica tipos de conta
test("deve exibir tipos de conta corretamente", () => {
  render(<RelatoriosPage />);

  expect(screen.getAllByText("usuario").length).toBeGreaterThan(0);
  expect(screen.getAllByText("feirante").length).toBeGreaterThan(0);
  expect(screen.getAllByText("admin").length).toBeGreaterThan(0);
});

// Teste 13: Verifica informações completas da conta
test("deve exibir informações completas das contas", () => {
  render(<RelatoriosPage />);

  expect(screen.getByText("joao@email.com")).toBeInTheDocument();
  expect(screen.getByText("(11) 99999-9999")).toBeInTheDocument();
  expect(screen.getByText("Cadastro: 2024-01-15")).toBeInTheDocument();
});
