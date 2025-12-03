import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ProdutosPage from "./page";

// Mock do Router do Next
jest.mock("next/navigation", () => ({
	useRouter() {
		return {
			push: jest.fn(),
		};
	},
}));

// MOCK: localStorage
beforeEach(() => {
	Storage.prototype.getItem = jest.fn(() => "usuario_logado");
});

// MOCK: window.confirm
global.confirm = jest.fn(() => true);

// MOCK GLOBAL DO FETCH
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe("Página de Produtos", () => {
	beforeEach(() => {
		jest.clearAllMocks();

		// resposta padrão da listagem
		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: () =>
				Promise.resolve([
					{
						id: 1,
						nome: "Produto Teste 1",
						descricao: "Desc 1",
						preco: 10,
					},
					{
						id: 2,
						nome: "Produto Para Excluir",
						descricao: "Desc 2",
						preco: 20,
					},
				]),
		});
	});

	test("deve exibir lista de produtos ao carregar", async () => {
		render(<ProdutosPage />);

		// Espera os produtos carregarem
		expect(await screen.findByText("Produto Teste 1")).toBeInTheDocument();
		expect(
			await screen.findByText("Produto Para Excluir")
		).toBeInTheDocument();
	});

	test("deve chamar DELETE ao excluir o produto", async () => {
		render(<ProdutosPage />);

		// Garante que carregou o item
		await waitFor(() =>
			expect(screen.getByText("Produto Para Excluir")).toBeInTheDocument()
		);

		const botoes = screen.getAllByText("Excluir");
		const botaoDoSegundo = botoes[1];

		// Quando clica em excluir → confirm() já retorna true
		fireEvent.click(botaoDoSegundo);

		// Segunda chamada do fetch deve ser o DELETE
		await waitFor(() => {
			expect(mockFetch).toHaveBeenCalledWith(
				"http://127.0.0.1:5000/api/produtos/2",
				expect.objectContaining({
					method: "DELETE",
				})
			);
		});
	});
});
