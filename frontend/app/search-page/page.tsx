"use client";

import { ProductService } from "@/services/Product/ProductService";
import Product from "@/types/ProductType";
import { useState } from "react";

export default function SearchPage() {

    const [products, setProducts] = useState<Product[]>([]);

	const handlerBuscarProduto = async (
		e: React.FormEvent<HTMLFormElement>
	) => {
		e.preventDefault();
		const response = await ProductService.getProducts();
        setProducts(response)
	};

	return (
		<>
			Lista de Produtos
			<form onSubmit={handlerBuscarProduto}>
				<label htmlFor="produto-name">Pesquisar Produto</label>
				<input
					type="text"
					name="produto-name"
					id="produto-name"
					placeholder="Pesquisar produto"
				/>

				<button type="submit">Buscar</button>
			</form>
			<ul>
				{products.map((product) => (
					<li key={product.id}>{product.nome}</li>
				))}
			</ul>
		</>
	);
}
