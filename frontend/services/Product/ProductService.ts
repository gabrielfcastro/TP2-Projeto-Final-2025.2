import { api } from "@/utils/api";

export interface Product {
  id: number;
  nome: string;
  preco: number;
}

export class ProductService {
  async getProducts(): Promise<Product[]> {
    const response = await api.request("/produtos");

    // return (await response.json()) as Product[];
    return response.json();
  }
}
