import Image from "next/image";
import Link from "next/link";
import type Product from "@/types/ProductType";
import { getRandomProductImage } from "@/utils/imageUtils";
import { useCart } from "@/hooks/useCart";
import { ShoppingCartIcon } from "@heroicons/react/24/solid";

export interface ProductCardProps {
	product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
	const imageUrl = getRandomProductImage(product.id, 400, 400);
	const { addToCart } = useCart();

	const handleAddToCart = (e: React.MouseEvent) => {
		e.preventDefault();
		e.stopPropagation();
		addToCart(product);
		alert(`${product.nome} adicionado ao carrinho!`);
	};

	return (
		<div
			key={product.id}
			className="group relative flex flex-col overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-lg"
			style={{
				backgroundColor: "var(--background)",
				borderColor: "var(--border-color)",
			}}
		>
			{/* Link para página de detalhes - envolve a imagem */}
			<Link href={`/produtos/${product.id}`} className="block">
				<div className="aspect-square overflow-hidden relative">
					<Image
						src={imageUrl}
						alt={product.nome}
						fill
						className="object-cover transition-transform duration-300 group-hover:scale-105"
						sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					/>
				</div>
			</Link>

			<div className="p-4 flex flex-col flex-1">
				{/* Link para página de detalhes - envolve o nome */}
				<Link href={`/produtos/${product.id}`}>
					<h3
						className="font-bold text-lg mb-2 transition-opacity hover:opacity-70"
						style={{ color: "var(--foreground)" }}
					>
						{product.nome}
					</h3>
				</Link>

				<p
					className="font-semibold mb-4"
					style={{ color: "var(--foreground)" }}
				>
					R$ {product.preco.toFixed(2)}
				</p>

				{/* Botão adicionar ao carrinho */}
				<button
					onClick={handleAddToCart}
					className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded-lg font-medium transition-opacity hover:opacity-90 mt-auto"
					style={{
						backgroundColor: "var(--foreground)",
						color: "var(--background)",
					}}
				>
					<ShoppingCartIcon className="h-5 w-5" />
					Adicionar ao Carrinho
				</button>
			</div>
		</div>
	);
}
