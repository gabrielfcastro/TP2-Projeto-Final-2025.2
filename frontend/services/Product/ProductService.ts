import type Product from "@/types/ProductType";
import { api } from "@/utils/api";

export class ProductService {
	static async getProducts(): Promise<Product[]> {
		const response = await api.request("/produtos");

		if (!response.ok) {
			throw new Error("Failed to fetch products");
		}

		return response.json();
	}

	static async getProduct(id: number): Promise<Product> {
		const response = await api.request(`/produtos/${id}`);

		if (!response.ok) {
			throw new Error("Failed to fetch product");
		}

		return response.json();
	}
}
