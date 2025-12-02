// services/ProductService.test.ts
import { ProductService } from "@/services/Product/ProductService";
import type Product from "@/types/ProductType";
import { api } from "@/utils/api";

jest.mock("@/utils/api"); // mocka o módulo api

describe("ProductService", () => {
	const mockedApiRequest = api.request as jest.MockedFunction<
		typeof api.request
	>;

	const productsMock: Product[] = [
		{
			id: 1,
			nome: "Produto 1",
			descricao: "Descrição 1",
			preco: 100,
			latitude: 100,
			longitude: 200,
			avaliacao_media: 4.5,
			total_avaliacoes: 10,
			data_criacao: "2021-01-01",
		},
		{
			id: 2,
			nome: "Produto 2",
			descricao: "Descrição 2",
			preco: 200,
			latitude: 101,
			longitude: 201,
			avaliacao_media: 4.6,
			total_avaliacoes: 11,
			data_criacao: "2021-01-02",
		},
		{
			id: 3,
			nome: "Produto 3",
			descricao: "Descrição 3",
			preco: 300,
			latitude: 102,
			longitude: 202,
			avaliacao_media: 4.7,
			total_avaliacoes: 12,
			data_criacao: "2021-01-03",
		},
	];

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve existir ProductService", () => {
		expect(ProductService).toBeDefined();
	});

	it("GET products list", async () => {
		const mockResponse = {
			ok: true,
			json: jest.fn().mockResolvedValue(productsMock),
		} as unknown as Response;

		mockedApiRequest.mockResolvedValue(mockResponse);

		const products = await ProductService.getProducts();

		expect(products).toEqual(productsMock);
		expect(mockedApiRequest).toHaveBeenCalledWith("/produtos");
		expect(mockResponse.json).toHaveBeenCalled();
	});

	it("GET product details", async () => {
		const mockResponse = {
			ok: true,
			json: jest.fn().mockResolvedValue(productsMock[0]),
		} as unknown as Response;

		mockedApiRequest.mockResolvedValue(mockResponse);

		const product = await ProductService.getProduct(1);

		expect(product).toEqual(productsMock[0]);
		expect(mockedApiRequest).toHaveBeenCalledWith("/produtos/1");
		expect(mockResponse.json).toHaveBeenCalled();
	});

	it("GET product details with invalid id", async () => {
		const mockResponse = {
			ok: false,
			json: jest.fn().mockResolvedValue(null),
		} as unknown as Response;

		mockedApiRequest.mockResolvedValue(mockResponse);

		await expect(ProductService.getProduct(999)).rejects.toThrow(
			"Failed to fetch product"
		);
	});
});
