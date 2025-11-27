import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NovoProdutoPage from "./page";

// 1. Mock do Fetch (Fingimos que o backend respondeu OK)
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ id: 10, nome: "Produto Teste", preco: 15 }),
  })
) as jest.Mock;

// 2. Mock do Roteamento (Para o router.push não quebrar o teste)
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
}));

describe("Página de Cadastro de Produto", () => {
  it("deve renderizar o formulário e enviar os dados corretos", async () => {
    render(<NovoProdutoPage />);

    // --- A. VERIFICAR SE OS CAMPOS EXISTEM ---
    const inputNome = screen.getByLabelText(/nome do produto/i);
    const inputDesc = screen.getByLabelText(/descrição/i);
    const inputPreco = screen.getByLabelText(/preço/i);
    const botaoSalvar = screen.getByRole("button", { name: /salvar/i });

    // --- B. PREENCHER O FORMULÁRIO ---
    fireEvent.change(inputNome, { target: { value: "Queijo Frescal" } });
    fireEvent.change(inputDesc, {
      target: { value: "Queijo feito hoje na fazenda" },
    });
    fireEvent.change(inputPreco, { target: { value: "25.00" } });

    // --- C. CLICAR EM SALVAR ---
    fireEvent.click(botaoSalvar);

    // --- D. VERIFICAR SE O FETCH FOI CHAMADO CORRETAMENTE ---
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/produtos"), // Verifica a URL
        expect.objectContaining({
          method: "POST",
          body: JSON.stringify({
            feirante_id: 1, // Estamos enviando fixo por enquanto
            nome: "Queijo Frescal",
            descricao: "Queijo feito hoje na fazenda",
            preco: 25.0,
          }),
        })
      );
    });
  });
});
