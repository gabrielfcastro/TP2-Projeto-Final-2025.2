/**
 * Gera uma URL de imagem aleatória usando Picsum Photos
 * Usa o ID do produto como seed para garantir que a mesma imagem seja sempre retornada
 * @param productId - ID do produto para usar como seed
 * @param width - Largura da imagem (padrão: 400)
 * @param height - Altura da imagem (padrão: 400)
 * @returns URL da imagem
 */
export function getRandomProductImage(
	productId: number,
	width: number = 400,
	height: number = 400
): string {
	// Picsum Photos permite usar um seed (número) para retornar sempre a mesma imagem
	return `https://picsum.photos/seed/${productId}/${width}/${height}`;
}

/**
 * Alternativa usando Unsplash Source (também gratuito, sem autenticação)
 * @param productId - ID do produto para usar como seed
 * @param width - Largura da imagem (padrão: 400)
 * @param height - Altura da imagem (padrão: 400)
 * @returns URL da imagem
 */
export function getRandomProductImageUnsplash(
	productId: number,
	width: number = 400,
	height: number = 400
): string {
	// Unsplash Source permite usar um ID como seed
	return `https://source.unsplash.com/${width}x${height}/?product&sig=${productId}`;
}
