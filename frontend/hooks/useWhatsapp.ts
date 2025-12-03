import { useCallback } from "react";
import { openWhatsApp } from "@/utils/whatsapp";

export function useWhatsApp() {
	const handleWhatsApp = useCallback(
		(
			phoneNumber: string | null,
			productName: string,
			productPrice: number
		) => {
			openWhatsApp(phoneNumber, productName, productPrice);
		},
		[]
	);

	return { handleWhatsApp };
}
