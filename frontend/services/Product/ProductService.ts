import type Product from "@/types/ProductType";
import { api } from "@/utils/api";

export class ProductService {
  async getProducts(): Promise<Product[]> {
    const response = await api.request("/produtos");

    // return (await response.json()) as Product[];
    return response.json();
  }
}
