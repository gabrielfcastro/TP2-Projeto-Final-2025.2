"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";

export default function NovoProdutoPage() {
	const [nome, setNome] = useState("");
	const [descricao, setDescricao] = useState("");
	const [preco, setPreco] = useState("");
	const router = useRouter();

	// 🔒 VERIFICAÇÃO DE LOGIN
	useEffect(() => {
		const usuario = localStorage.getItem("feiranet_usuario");

		if (!usuario) {
			router.push("/login"); // redireciona pra home
			return;
		}
	}, [router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const res = await fetch("http://127.0.0.1:5000/api/produtos/", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					feirante_id: 1,
					nome,
					descricao,
					preco: parseFloat(preco),
				}),
			});

			if (res.ok) {
				router.push("/produtos");
			} else {
				alert("Erro ao salvar produto");
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<main className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-6 text-zinc-100">
			<div className="w-full max-w-lg">
				{/* Link de Voltar */}
				<Link
					href="/produtos"
					className="flex items-center text-zinc-400 hover:text-green-500 mb-6 transition-colors text-sm font-medium"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth={2}
						stroke="currentColor"
						className="w-4 h-4 mr-2"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
						/>
					</svg>
					Voltar para a lista
				</Link>

				<h1 className="text-3xl font-bold mb-8 text-white tracking-tight">
					Novo Produto
				</h1>

				{/* Card do Formulário */}
				<form
					onSubmit={handleSubmit}
					className="bg-zinc-900 border border-zinc-800 p-8 rounded-xl shadow-2xl"
				>
					{/* Campo Nome */}
					<div className="mb-6">
						<label
							htmlFor="nome"
							className="block text-sm font-medium text-zinc-400 mb-2"
						>
							Nome do Produto
						</label>
						<input
							id="nome"
							type="text"
							placeholder="Ex: Queijo Frescal"
							className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-zinc-600 transition-all"
							value={nome}
							onChange={(e) => setNome(e.target.value)}
							required
						/>
					</div>

					{/* Campo Descrição */}
					<div className="mb-6">
						<label
							htmlFor="descricao"
							className="block text-sm font-medium text-zinc-400 mb-2"
						>
							Descrição
						</label>
						<textarea
							id="descricao"
							rows={3}
							placeholder="Descreva os detalhes do produto..."
							className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-zinc-600 transition-all resize-none"
							value={descricao}
							onChange={(e) => setDescricao(e.target.value)}
						/>
					</div>

					{/* Campo Preço */}
					<div className="mb-8">
						<label
							htmlFor="preco"
							className="block text-sm font-medium text-zinc-400 mb-2"
						>
							Preço (R$)
						</label>
						<div className="relative">
							<span className="absolute left-3 top-3 text-zinc-500">
								R$
							</span>
							<input
								id="preco"
								type="number"
								step="0.01"
								placeholder="0.00"
								className="w-full bg-zinc-800 border border-zinc-700 text-white p-3 pl-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent placeholder-zinc-600 transition-all"
								value={preco}
								onChange={(e) => setPreco(e.target.value)}
								required
							/>
						</div>
					</div>

					{/* Botão Salvar */}
					<button
						type="submit"
						className="w-full bg-green-600 text-white p-4 rounded-lg font-bold hover:bg-green-500 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-green-500/20"
					>
						Salvar Produto
					</button>
				</form>
			</div>
		</main>
	);
}
