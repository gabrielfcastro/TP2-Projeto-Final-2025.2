// utils/mockHandler.ts
function parseQueryParams(endpoint: string): URLSearchParams {
	const [, queryString] = endpoint.split("?");
	return new URLSearchParams(queryString || "");
}

export async function getMockResponse(endpoint: string): Promise<Response> {
	await new Promise((resolve) => setTimeout(resolve, 300));

	let mockData: unknown;
	const [path] = endpoint.split("?");
	const queryParams = parseQueryParams(endpoint);

	if (path === "/produtos" || path === "/produtos/") {
		const { mockProducts } = await import("@/mocks/products");
		
		// Filtra por nome se o parâmetro estiver presente
		if (queryParams.has("nome")) {
			const nomeFilter = queryParams.get("nome")?.toLowerCase() || "";
			mockData = mockProducts.filter((product) =>
				product.nome.toLowerCase().includes(nomeFilter)
			);
		} else {
			mockData = mockProducts;
		}
	} else if (path.match(/^\/produtos\/\d+$/)) {
		const id = parseInt(path.split("/").pop() || "0", 10);
		const { getMockProduct } = await import("@/mocks/products");
		const product = getMockProduct(id);
		if (!product) {
			return new Response(JSON.stringify({ error: "Product not found" }), {
				status: 404,
				statusText: "Not Found",
				headers: { "Content-Type": "application/json" },
			});
		}
		mockData = product;
	} else {
		mockData = { message: "Mock endpoint not implemented", endpoint };
	}

	return new Response(JSON.stringify(mockData), {
		status: 200,
		statusText: "OK",
		headers: { "Content-Type": "application/json" },
	});
}

export function isNetworkError(error: unknown): boolean {
	return (
		error instanceof TypeError &&
		(error.message.includes("fetch") ||
			error.message.includes("NetworkError") ||
			error.message.includes("Failed to fetch"))
	);
}

