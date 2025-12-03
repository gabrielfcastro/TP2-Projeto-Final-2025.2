"use client";

import { FC, useState, useRef, useEffect } from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

interface SearchBarProps {
	query: string;
	setQuery: (value: string) => void;
	onSearch: (e: React.FormEvent) => void;
	loading?: boolean;
}

const MOCK_PRODUCTS = [
	"Tênis Esportivo Runner",
	"Sapato Social Couro",
	"Sneaker Urbano Azul",
	"Tênis Casual Branco",
	"Sneaker Pastel Vibes",
	"Slip-On Quadriculado",
];

const SearchBar: FC<SearchBarProps> = ({
	query,
	setQuery,
	onSearch,
	loading = false,
}) => {
	const [showResults, setShowResults] = useState(false);
	const [results, setResults] = useState<string[]>([]);

	const wrapperRef = useRef<HTMLFormElement>(null);

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				wrapperRef.current &&
				!wrapperRef.current.contains(event.target as Node)
			) {
				setShowResults(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () =>
			document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const handleInputChange = (val: string) => {
		setQuery(val);

		if (val.trim() === "") {
			setResults([]);
			setShowResults(false);
		} else {
			const filtered = MOCK_PRODUCTS.filter((p) =>
				p.toLowerCase().includes(val.toLowerCase())
			);
			setResults(filtered);
			setShowResults(true);
		}
	};

	const handleSelect = (item: string) => {
		setQuery(item);
		setShowResults(false);
		// Criar um evento sintético para o handleSearch
		const syntheticEvent = {
			preventDefault: () => {},
			stopPropagation: () => {},
			nativeEvent: {} as Event,
			currentTarget: {} as HTMLFormElement,
			target: {} as HTMLFormElement,
			bubbles: false,
			cancelable: false,
			defaultPrevented: false,
			eventPhase: 0,
			isTrusted: false,
			timeStamp: 0,
			type: "submit",
		} as unknown as React.FormEvent<HTMLFormElement>;
		onSearch(syntheticEvent);
	};

	const handleClear = () => {
		setQuery("");
		setResults([]);
		setShowResults(false);
	};

	return (
		<form onSubmit={onSearch} ref={wrapperRef} className="relative w-full">
			{/* Input container */}
			<div
				className="flex items-center w-full rounded-xl border shadow-sm focus-within:ring-2 focus-within:ring-primary transition-all duration-200"
				style={{
					backgroundColor: "var(--background)",
					borderColor: "var(--border-color)",
				}}
			>
				{/* Icone de busca */}
				<div className="flex items-center justify-center pl-3">
					<MagnifyingGlassIcon
						className="h-5 w-5"
						style={{ color: "var(--foreground)" }}
					/>
				</div>

				{/* Input */}
				<input
					type="text"
					id="produto-name"
					value={query}
					onChange={(e) => handleInputChange(e.target.value)}
					placeholder="Pesquisar produto"
					className="flex-1 h-12 px-3 placeholder:opacity-60 focus:outline-none bg-transparent"
					style={{
						color: "var(--foreground)",
					}}
				/>

				{/* Botão limpar */}
				{query && (
					<button
						type="button"
						onClick={handleClear}
						className="flex items-center justify-center h-10 w-10 hover:opacity-70 transition-opacity"
						style={{ color: "var(--foreground)" }}
					>
						<XMarkIcon className="h-5 w-5" />
					</button>
				)}

				{/* Botão buscar */}
				<button
					type="submit"
					disabled={loading}
					className="flex items-center justify-center h-12 px-4 rounded-r-xl ml-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
					style={{
						backgroundColor: "var(--foreground)",
						color: "var(--background)",
					}}
				>
					{loading ? "Buscando..." : "Buscar"}
				</button>
			</div>

			{/* Dropdown de sugestões */}
			{showResults && results.length > 0 && (
				<ul
					className="absolute z-10 mt-1 w-full rounded-xl shadow-lg max-h-60 overflow-y-auto"
					style={{
						backgroundColor: "var(--background)",
						border: "1px solid var(--border-color)",
					}}
				>
					{results.map((item) => (
						<li
							key={item}
							onMouseDown={() => handleSelect(item)}
							className="px-4 py-2 cursor-pointer transition-colors"
							style={{
								color: "var(--foreground)",
							}}
							onMouseEnter={(e) => {
								e.currentTarget.style.backgroundColor =
									"var(--hover-bg)";
							}}
							onMouseLeave={(e) => {
								e.currentTarget.style.backgroundColor =
									"transparent";
							}}
						>
							{item}
						</li>
					))}
				</ul>
			)}
		</form>
	);
};

export default SearchBar;
