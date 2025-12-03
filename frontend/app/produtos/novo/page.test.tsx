import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NovoProdutoPage from "./page";

// 🔧 Mock do Router
const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
	useRouter: () => ({
		push: mockPush,
	}),
}));

// 🔧 Mock do fetch
global.fetch = jest.fn(() =>
	Promise.resolve({
		ok: true,
		json: () =>
			Promise.resolve({
				id: 10,
				nome: "Produto Teste",
				descricao: "Teste",
				preco: 15,
			}),
	})
) as jest.Mock;

// 🔧 Mock do localStorage
beforeEach(() => {
	Storage.prototype.getItem = jest.fn(() => "usuario_logado");
	jest.clearAllMocks();
});

describe("Página de Cadastro de Produto", () => {
	test("deve enviar os dados corretos ao salvar", async () => {
		render(<NovoProdutoPage />);

		// Campos
		const inputNome = screen.getByLabelText(/nome do produto/i);
		const inputDesc = screen.getByLabelText(/descrição/i);
		const inputPreco = screen.getByLabelText(/preço/i);
		const botaoSalvar = screen.getByRole("button", {
			name: /salvar produto/i,
		});

		// Preenche dados
		fireEvent.change(inputNome, { target: { value: "Queijo Frescal" } });
		fireEvent.change(inputDesc, {
			target: { value: "Queijo feito hoje na fazenda" },
		});
		fireEvent.change(inputPreco, { target: { value: "25.00" } });

		// Envia form
		fireEvent.click(botaoSalvar);

		// Valida chamada do fetch
		await waitFor(() => {
			expect(global.fetch).toHaveBeenCalledWith(
				"http://127.0.0.1:5000/api/produtos/",
				expect.objectContaining({
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						feirante_id: 1,
						nome: "Queijo Frescal",
						descricao: "Queijo feito hoje na fazenda",
						preco: 25.0,
					}),
				})
			);
		});

		// Verifica redirect
		await waitFor(() => {
			expect(mockPush).toHaveBeenCalledWith("/produtos");
		});
	});
});
