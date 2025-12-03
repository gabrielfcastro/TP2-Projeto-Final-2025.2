// services/ProductService.test.ts
import { ProductService } from "@/services/Product/ProductService";
import type Product from "@/types/ProductType";
import api from "@/utils/api";
import type { AxiosRequestConfig } from "axios";

jest.mock("@/utils/api"); // mocka o módulo api

describe("ProductService", () => {
	const mockedApi = api as jest.Mocked<typeof api>;

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
		mockedApi.get.mockResolvedValue({
			data: productsMock,
			status: 200,
			statusText: "OK",
			headers: {},
			config: {} as AxiosRequestConfig,
		});

		const products = await ProductService.getProducts();

		expect(products).toEqual(productsMock);
		expect(mockedApi.get).toHaveBeenCalledWith("/produtos");
	});

	it("GET products list with nome filter", async () => {
		const filteredProducts = [productsMock[0]];
		mockedApi.get.mockResolvedValue({
			data: filteredProducts,
			status: 200,
			statusText: "OK",
			headers: {},
			config: {} as AxiosRequestConfig,
		});

		const products = await ProductService.getProducts("Produto 1");

		expect(products).toEqual(filteredProducts);
		expect(mockedApi.get).toHaveBeenCalledWith(
			"/produtos?nome=Produto%201"
		);
	});

	it("GET product details", async () => {
		mockedApi.get.mockResolvedValue({
			data: productsMock[0],
			status: 200,
			statusText: "OK",
			headers: {},
			config: {} as AxiosRequestConfig,
		});

		const product = await ProductService.getProduct(1);

		expect(product).toEqual(productsMock[0]);
		expect(mockedApi.get).toHaveBeenCalledWith("/produtos/1");
	});

	it("GET product details with invalid id", async () => {
		mockedApi.get.mockRejectedValue(
			new Error("Request failed with status code 404")
		);

		await expect(ProductService.getProduct(999)).rejects.toThrow();
		expect(mockedApi.get).toHaveBeenCalledWith("/produtos/999");
	});
});
