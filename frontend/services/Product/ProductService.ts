import type Product from "@/types/ProductType";
import api from "@/utils/api";

export class ProductService {
	static async getProducts(nome?: string): Promise<Product[]> {
		const response = await api.get<Product[]>('/produtos');

		if (nome) {
			response.data = response.data.filter((product) =>
				product.nome.toLowerCase().includes(nome.toLowerCase())
			);
		}
		return response.data;
	}

	static async getProduct(id: number): Promise<Product> {
		const response = await api.get<Product>(`/produtos/${id}`);
		return response.data;
	}
}
