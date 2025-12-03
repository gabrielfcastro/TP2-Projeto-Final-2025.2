// Função para gerar número de WhatsApp aleatório
export function getRandomWhatsAppNumber(): string {
	// Gerar número aleatório no formato brasileiro (DDD + 9 dígitos)
	// DDDs comuns do Brasil (11, 21, 31, 41, 47, 48, 51, 61, 71, 81, 85)
	const dddList = [11, 21, 31, 41, 47, 48, 51, 61, 71, 81, 85];
	const randomDDD = dddList[Math.floor(Math.random() * dddList.length)];

	// Gerar 9 dígitos aleatórios (formato: 9XXXXXXXX)
	const randomDigits = Math.floor(100000000 + Math.random() * 900000000);

	// Formato: 55 + DDD + número (ex: 55619987654321)
	return `55${randomDDD}${randomDigits}`;
}

// Função para abrir WhatsApp
export function openWhatsApp(
	phoneNumber: string | null,
	productName: string,
	productPrice: number
) {
	// Se não tiver número informado, usar número aleatório
	const number = phoneNumber || getRandomWhatsAppNumber();

	const message = encodeURIComponent(
		`Olá! Tenho interesse no produto: ${productName}\nPreço: R$ ${productPrice}\n\nGostaria de mais informações.`
	);
	const whatsappUrl = `https://wa.me/${number}?text=${message}`;
	window.open(whatsappUrl, "_blank");
}
