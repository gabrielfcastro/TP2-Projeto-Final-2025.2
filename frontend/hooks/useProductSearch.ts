import { ProductService } from "@/services/Product/ProductService";
import type Product from "@/types/ProductType";
import { useState } from "react";


export function useProductSearch() {
  const [products, setProducts] = useState<Product[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");


  const handleSearch = async (e: React.FormEvent) => {

    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      const response = await ProductService.getProducts(query.trim());
      setProducts(response);
    } catch (err: unknown) {
      setError("Erro ao buscar produtos. Tente novamente.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  } 



  return { products, query, loading, error, setQuery, handleSearch };
}