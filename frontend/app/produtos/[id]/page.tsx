"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductService } from "@/services/Product/ProductService";
import { getRandomProductImage } from "@/utils/imageUtils";
import { useCart } from "@/hooks/useCart";
import type Product from "@/types/ProductType";

export default function ProductDetailsPage() {
	const params = useParams();
	const productId = Number(params.id);
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");
	const { addToCart } = useCart();

	useEffect(() => {
		async function loadProduct() {
			try {
				setLoading(true);
				const data = await ProductService.getProduct(productId);
				setProduct(data);
			} catch (err) {
				setError("Erro ao carregar produto");
				console.error(err);
			} finally {
				setLoading(false);
			}
		}

		if (productId) {
			loadProduct();
		}
	}, [productId]);

	const handleAddToCart = () => {
		if (product) {
			addToCart(product);
			alert(`${product.nome} adicionado ao carrinho!`);
		}
	};

	if (loading) {
		return (
			<main
				className="min-h-screen p-8"
				style={{
					backgroundColor: "var(--background)",
					color: "var(--foreground)",
				}}
			>
				<div className="max-w-4xl mx-auto">
					<p>Carregando...</p>
				</div>
			</main>
		);
	}

	if (error || !product) {
		return (
			<main
				className="min-h-screen p-8"
				style={{
					backgroundColor: "var(--background)",
					color: "var(--foreground)",
				}}
			>
				<div className="max-w-4xl mx-auto">
					<p style={{ color: "red" }}>
						{error || "Produto não encontrado"}
					</p>
					<Link
						href="/search-page"
						className="mt-4 inline-block px-4 py-2 rounded-lg transition-opacity hover:opacity-90"
						style={{
							backgroundColor: "var(--foreground)",
							color: "var(--background)",
						}}
					>
						Voltar para busca
					</Link>
				</div>
			</main>
		);
	}

	const imageUrl = getRandomProductImage(product.id, 600, 600);

	return (
		<main
			className="min-h-screen p-8"
			style={{
				backgroundColor: "var(--background)",
				color: "var(--foreground)",
			}}
		>
			<div className="max-w-4xl mx-auto">
				<Link
					href="/search-page"
					className="mb-6 inline-block text-sm transition-opacity hover:opacity-70"
					style={{ color: "var(--foreground)" }}
				>
					← Voltar para busca
				</Link>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
					{/* Imagem */}
					<div className="aspect-square overflow-hidden rounded-xl relative">
						<Image
							src={imageUrl}
							alt={product.nome}
							fill
							className="object-cover"
							sizes="(max-width: 768px) 100vw, 50vw"
						/>
					</div>

					{/* Informações */}
					<div className="flex flex-col gap-6">
						<div>
							<h1
								className="text-3xl font-bold mb-2"
								style={{ color: "var(--foreground)" }}
							>
								{product.nome}
							</h1>
							{product.descricao && (
								<p
									className="text-lg opacity-80"
									style={{ color: "var(--foreground)" }}
								>
									{product.descricao}
								</p>
							)}
						</div>

						<div
							className="border-t pt-4"
							style={{ borderColor: "var(--border-color)" }}
						>
							<p
								className="text-4xl font-bold mb-4"
								style={{ color: "var(--foreground)" }}
							>
								R$ {product.preco.toFixed(2)}
							</p>

							{product.avaliacao_media > 0 && (
								<div className="mb-4">
									<p
										className="text-sm opacity-70"
										style={{ color: "var(--foreground)" }}
									>
										⭐ {product.avaliacao_media.toFixed(1)}{" "}
										({product.total_avaliacoes} avaliações)
									</p>
								</div>
							)}
						</div>

						<div className="flex gap-4">
							<button
								onClick={handleAddToCart}
								className="flex-1 px-6 py-3 rounded-lg font-semibold transition-opacity hover:opacity-90"
								style={{
									backgroundColor: "var(--foreground)",
									color: "var(--background)",
								}}
							>
								Adicionar ao Carrinho
							</button>
						</div>

						{/* Informações adicionais */}
						<div
							className="mt-4 space-y-2 text-sm opacity-70"
							style={{ color: "var(--foreground)" }}
						>
							{product.latitude && product.longitude && (
								<p>
									📍 Localização:{" "}
									{product.latitude.toFixed(4)},{" "}
									{product.longitude.toFixed(4)}
								</p>
							)}
							{product.data_criacao && (
								<p>
									📅 Cadastrado em:{" "}
									{new Date(
										product.data_criacao
									).toLocaleDateString("pt-BR")}
								</p>
							)}
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}
