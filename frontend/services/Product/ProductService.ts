import type Product from "@/types/ProductType";
import api from "@/utils/api";

export class ProductService {
	static async getProducts(nome?: string): Promise<Product[]> {
		const endpoint = nome
			? `/produtos?nome=${encodeURIComponent(nome)}`
			: "/produtos";
		const response = await api.get<Product[]>(endpoint);
		return response.data;
	}

	static async getProduct(id: number): Promise<Product> {
		const response = await api.get<Product>(`/produtos/${id}`);
		return response.data;
	}
}
