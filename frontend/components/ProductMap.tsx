"use client";

import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";

interface ProductMapProps {
	latitude?: number | null;
	longitude?: number | null;
	productName: string;
	productId: number;
}

// Função para gerar coordenadas aleatórias baseadas no ID do produto (para consistência)
function getRandomCoordinates(productId: number): [number, number] {
	// Coordenadas de Brasília (centro)
	const brasiliaLat = -15.7975;
	const brasiliaLng = -47.8919;

	// Raio de variação (aproximadamente 50-100 km ao redor de Brasília)
	// 1 grau de latitude ≈ 111 km
	const latVariation = 0.5; // ~55 km
	const lngVariation = 0.5; // ~55 km

	// Gerar coordenadas pseudo-aleatórias baseadas no ID
	const seed = productId * 12345;
	const latOffset = ((seed % 10000) / 10000 - 0.5) * 2 * latVariation; // -0.5 a 0.5, depois * 2 * variation
	const lngOffset = (((seed * 7) % 10000) / 10000 - 0.5) * 2 * lngVariation;

	const lat = brasiliaLat + latOffset;
	const lng = brasiliaLng + lngOffset;

	return [lat, lng];
}

export default function ProductMap({
	latitude,
	longitude,
	productName,
	productId,
}: ProductMapProps) {
	const mapRef = useRef<{ remove: () => void } | null>(null);
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
	}, []);

	useEffect(() => {
		if (!isClient || !mapContainerRef.current || mapRef.current) return;

		// Importar Leaflet dinamicamente apenas no cliente
		import("leaflet").then((L) => {
			// Corrigir ícones padrão do Leaflet
			delete (
				L.default.Icon.Default.prototype as unknown as {
					_getIconUrl?: string;
				}
			)._getIconUrl;
			L.default.Icon.Default.mergeOptions({
				iconRetinaUrl:
					"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
				iconUrl:
					"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
				shadowUrl:
					"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
			});

			// Usar coordenadas reais ou gerar aleatórias
			const hasRealCoordinates = latitude != null && longitude != null;
			const [mapLat, mapLng] = hasRealCoordinates
				? [latitude, longitude]
				: getRandomCoordinates(productId);

			// Inicializar o mapa
			const map = L.default
				.map(mapContainerRef.current!)
				.setView([mapLat, mapLng], hasRealCoordinates ? 13 : 10);

			// Adicionar tile layer do OpenStreetMap
			L.default
				.tileLayer(
					"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
					{
						attribution:
							'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
						maxZoom: 19,
					}
				)
				.addTo(map);

			// Sempre mostrar apenas um marcador
			const popupText = hasRealCoordinates
				? productName
				: `${productName} (Localização aproximada)`;

			L.default
				.marker([mapLat, mapLng])
				.addTo(map)
				.bindPopup(popupText)
				.openPopup();

			mapRef.current = map;
		});

		// Cleanup
		return () => {
			if (mapRef.current) {
				mapRef.current.remove();
				mapRef.current = null;
			}
		};
	}, [isClient, latitude, longitude, productName, productId]);

	return (
		<div
			ref={mapContainerRef}
			className="w-full h-64 rounded-xl overflow-hidden"
			style={{
				border: "1px solid var(--border-color)",
			}}
		/>
	);
}
