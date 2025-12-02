"use client";

import { useProductSearch } from "@/hooks/useProductSearch";

export default function SearchPage() {
  const { products, query, loading, error, setQuery, handleSearch } = useProductSearch();

  return (
    <>
      <h1>Lista de Produtos</h1>

      <form onSubmit={handleSearch}>
        <label htmlFor="produto-name">Pesquisar Produto</label>

        <input
          type="text"
          id="produto-name"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Pesquisar produto"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Buscando..." : "Buscar"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {products.map((product) => (
          <li key={product.id}>{product.nome}</li>
        ))}
      </ul>
    </>
  );
}
