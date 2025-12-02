// utils/mockHandler.ts
export async function getMockResponse(endpoint: string): Promise<Response> {
	await new Promise((resolve) => setTimeout(resolve, 300));

	let mockData: unknown;

	if (endpoint === "/produtos" || endpoint === "/produtos/") {
		const { mockProducts } = await import("@/mocks/products");
		mockData = mockProducts;
	} else if (endpoint.match(/^\/produtos\/\d+$/)) {
		const id = parseInt(endpoint.split("/").pop() || "0", 10);
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

