import { useState, useEffect } from "react";
import type Product from "@/types/ProductType";

export interface CartItem {
	product: Product;
	quantity: number;
}

const CART_STORAGE_KEY = "feiranet_cart";

function loadCartFromStorage(): CartItem[] {
	if (typeof window === "undefined") return [];

	const storedCart = localStorage.getItem(CART_STORAGE_KEY);
	if (storedCart) {
		try {
			return JSON.parse(storedCart);
		} catch (error) {
			console.error("Erro ao carregar carrinho:", error);
			return [];
		}
	}
	return [];
}

export function useCart() {
	const [cart, setCart] = useState<CartItem[]>(loadCartFromStorage);

	// Salvar carrinho no localStorage sempre que mudar
	useEffect(() => {
		localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
	}, [cart]);

	const addToCart = (product: Product, quantity: number = 1) => {
		setCart((prevCart) => {
			const existingItem = prevCart.find(
				(item) => item.product.id === product.id
			);

			if (existingItem) {
				// Se o produto já existe, aumenta a quantidade
				return prevCart.map((item) =>
					item.product.id === product.id
						? { ...item, quantity: item.quantity + quantity }
						: item
				);
			} else {
				// Se não existe, adiciona novo item
				return [...prevCart, { product, quantity }];
			}
		});
	};

	const removeFromCart = (productId: number) => {
		setCart((prevCart) =>
			prevCart.filter((item) => item.product.id !== productId)
		);
	};

	const updateQuantity = (productId: number, quantity: number) => {
		if (quantity <= 0) {
			removeFromCart(productId);
			return;
		}

		setCart((prevCart) =>
			prevCart.map((item) =>
				item.product.id === productId ? { ...item, quantity } : item
			)
		);
	};

	const clearCart = () => {
		setCart([]);
	};

	const getTotalItems = () => {
		return cart.reduce((total, item) => total + item.quantity, 0);
	};

	const getTotalPrice = () => {
		return cart.reduce(
			(total, item) => total + item.product.preco * item.quantity,
			0
		);
	};

	return {
		cart,
		addToCart,
		removeFromCart,
		updateQuantity,
		clearCart,
		getTotalItems,
		getTotalPrice,
	};
}
