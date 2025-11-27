import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProdutosPage from "./page";

// 1. Mock do Fetch Global
// Simulamos que existem produtos na lista
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve([
        { id: 1, nome: "Produto Teste 1", descricao: "Desc 1", preco: 10 },
        { id: 2, nome: "Produto Para Excluir", descricao: "Desc 2", preco: 20 },
      ]),
  })
) as jest.Mock;

describe("Página de Listagem de Produtos", () => {
  it("deve excluir um item quando o botão for clicado", async () => {
    render(<ProdutosPage />);

    // A. Espera o produto aparecer na tela (pois o fetch é assíncrono)
    await waitFor(() => {
      expect(screen.getByText("Produto Para Excluir")).toBeInTheDocument();
    });

    // B. Procura todos os botões de excluir
    const botoesExcluir = screen.getAllByText("Excluir");
    const botaoDoSegundoItem = botoesExcluir[1]; // Pega o botão do segundo item

    // C. Clica no botão
    fireEvent.click(botaoDoSegundoItem);

    // D. Verifica se chamou a API com DELETE no ID certo (ID 2)
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/produtos/2"), // Verifica se a URL tem o ID 2
        expect.objectContaining({
          method: "DELETE",
        })
      );
    });
  });
});
