"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ProductService } from "@/services/Product/ProductService";
import { getRandomProductImage } from "@/utils/imageUtils";
import ProductMap from "@/components/ProductMap";
import type Product from "@/types/ProductType";
import { useWhatsApp } from "@/hooks/useWhatsapp";

export default function ProductDetailsPage() {
	const params = useParams();
	const productId = Number(params.id);
	const [product, setProduct] = useState<Product | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string>("");
	const { handleWhatsApp } = useWhatsApp();

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

	const onWhatsAppClick = () => {
		if (product) {
			// Passar null para gerar número aleatório (caso não tenha número informado)
			// Se o produto tivesse link_wpp do feirante, passaria aqui
			handleWhatsApp(null, product.nome, product.preco);
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
								R$ {Number(product.preco).toFixed(2)}
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
								onClick={onWhatsAppClick}
								className="flex-1 px-6 py-3 rounded-lg font-semibold transition-all hover:opacity-90 flex items-center justify-center gap-2"
								style={{
									backgroundColor: "#25D366",
									color: "#FFFFFF",
								}}
							>
								{/* Ícone do WhatsApp */}
								<svg
									width="20"
									height="20"
									viewBox="0 0 24 24"
									fill="currentColor"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
								</svg>
								Falar com Feirante
							</button>
						</div>

						{/* Informações adicionais */}
						<div
							className="mt-4 space-y-2 text-sm opacity-70"
							style={{ color: "var(--foreground)" }}
						>
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

				{/* Mapa - sempre exibido, com coordenadas reais ou aleatórias */}
				<div className="mt-8">
					<h2
						className="text-xl font-bold mb-4"
						style={{ color: "var(--foreground)" }}
					>
						📍 Localização
					</h2>
					{product.latitude && product.longitude ? (
						<p
							className="text-sm opacity-70 mb-4"
							style={{ color: "var(--foreground)" }}
						>
							{product.latitude.toFixed(4)},{" "}
							{product.longitude.toFixed(4)}
						</p>
					) : (
						<p
							className="text-sm opacity-70 mb-4"
							style={{ color: "var(--foreground)" }}
						>
							Localização aproximada
						</p>
					)}
					<ProductMap
						latitude={product.latitude ?? null}
						longitude={product.longitude ?? null}
						productName={product.nome}
						productId={product.id}
					/>
				</div>
			</div>
		</main>
	);
}
