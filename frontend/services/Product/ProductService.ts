import type Product from "@/types/ProductType";
import api from "@/utils/api";

export class ProductService {
	static async getProducts(nome?: string): Promise<Product[]> {
		let url = "/produtos";

		// se vier nome, enviar na URL conforme o teste espera
		if (nome) {
			const encoded = encodeURIComponent(nome);
			url = `/produtos?nome=${encoded}`;
		}

		const response = await api.get<Product[]>(url);
		return response.data;
	}

	static async getProduct(id: number): Promise<Product> {
		const response = await api.get<Product>(`/produtos/${id}`);
		return response.data;
	}
}
