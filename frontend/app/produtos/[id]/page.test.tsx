import "@testing-library/jest-dom";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import EditarProdutoPage from "./page";

// 1. Mock do Fetch Global
global.fetch = jest.fn((url) => {
  // Se for GET (Carregar dados)
  if (url.toString().endsWith("/api/produtos/1")) {
    return Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve({
          id: 1,
          nome: "Produto Antigo",
          descricao: "Desc Antiga",
          preco: 10,
        }),
    });
  }
  // Se for PUT (Salvar)
  return Promise.resolve({ ok: true, json: () => Promise.resolve({}) });
}) as jest.Mock;

// 2. Mock do Next.js (Router e Params)
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: jest.fn() }),
  useParams: () => ({ id: "1" }), // Simulamos que estamos na URL /produtos/1
}));

describe("Página de Edição de Produto", () => {
  it("deve carregar dados e enviar atualização (PUT)", async () => {
    render(<EditarProdutoPage />);

    // A. Verifica se os campos foram preenchidos com os dados do backend
    await waitFor(() => {
      expect(screen.getByDisplayValue("Produto Antigo")).toBeInTheDocument();
    });

    // B. Edita o nome
    const inputNome = screen.getByLabelText(/nome do produto/i);
    fireEvent.change(inputNome, { target: { value: "Produto Editado" } });

    // C. Clica em Salvar
    const botaoSalvar = screen.getByRole("button", {
      name: /salvar alterações/i,
    });
    fireEvent.click(botaoSalvar);

    // D. Verifica se enviou PUT para a URL certa
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/produtos/1"),
        expect.objectContaining({
          method: "PUT", // Importante: Tem que ser PUT
          body: JSON.stringify({
            nome: "Produto Editado",
            descricao: "Desc Antiga",
            preco: 10,
          }),
        })
      );
    });
  });
});
