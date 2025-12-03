import Link from "next/link";

export default function NavBar() {
	return (
		<div className="">
			<div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
				<Link href={"/pesquisar"} className="">
					Produtos
				</Link>
				<Link href={"/meu-carrinho"} className="">
					Meu Carrinho
				</Link>
			</div>
		</div>
	);
}
