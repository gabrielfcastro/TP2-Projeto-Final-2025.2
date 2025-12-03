"use client";

import ProductCard from "@/components/ProductCard";
import SearchBar from "@/components/SearchBar";
import { useProductSearch } from "@/hooks/useProductSearch";

export default function SearchPage() {
	const { products, query, loading, error, setQuery, handleSearch } =
		useProductSearch();

	return (
		<main className="min-h-screen bg-zinc-950 p-10 text-zinc-100">
			<h1 className="text-4xl font-bold mb-8 text-white tracking-tight text-center">
				Lista de Produtos
			</h1>

			<div className="max-w-6xl mx-auto mb-8">
				<SearchBar
					query={query}
					setQuery={setQuery}
					onSearch={handleSearch}
					loading={loading}
				/>
			</div>

			{error && (
				<div className="max-w-6xl mx-auto mb-4">
					<p className="text-red-500 text-center">{error}</p>
				</div>
			)}

			<div className="max-w-6xl mx-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
					{products.map((product) => (
						<ProductCard key={product.id} product={product} />
					))}
				</div>
			</div>
		</main>
	);
}
