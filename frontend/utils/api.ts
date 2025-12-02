// utils/api.ts
import { getMockResponse, isNetworkError } from "./mockHandler";

type RequestInterceptor = (
	url: string,
	options: RequestInit
) => Promise<void> | void;
type ResponseInterceptor = (response: Response) => Promise<void> | void;

class Api {
	private baseUrl: string;
	private defaultHeaders: Record<string, string> = {};
	private requestInterceptors: RequestInterceptor[] = [];
	private responseInterceptors: ResponseInterceptor[] = [];
	private useMock: boolean;

	constructor() {
		const baseUrl =
			process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000/api";
		this.baseUrl = baseUrl;
		this.useMock =
			process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
			(typeof window !== "undefined" &&
				localStorage.getItem("useMock") === "true");

		// interceptors globais já definidos aqui
		this.addRequestInterceptor(async (url, options) => {
			const token = localStorage.getItem("token");
			if (token) {
				options.headers = {
					...options.headers,
					Authorization: `Bearer ${token}`,
				};
			}
		});

		this.addResponseInterceptor((response) => {
			console.log("Response global:", response.status, response.url);
		});
	}

	setDefaultHeaders(headers: Record<string, string>) {
		this.defaultHeaders = headers;
	}

	addRequestInterceptor(interceptor: RequestInterceptor) {
		this.requestInterceptors.push(interceptor);
	}

	addResponseInterceptor(interceptor: ResponseInterceptor) {
		this.responseInterceptors.push(interceptor);
	}

	async request(
		endpoint: string,
		options: RequestInit = {}
	): Promise<Response> {
		if (this.useMock) {
			console.log(`[MOCK] ${options.method || "GET"} ${endpoint}`);
			return getMockResponse(endpoint);
		}

		const url = `${this.baseUrl}${endpoint}`;
		const requestOptions: RequestInit = {
			...options,
			headers: { ...this.defaultHeaders, ...(options.headers || {}) },
		};

		for (const interceptor of this.requestInterceptors) {
			await interceptor(url, requestOptions);
		}

		try {
			const response = await fetch(url, requestOptions);

			for (const interceptor of this.responseInterceptors) {
				await interceptor(response);
			}

			return response;
		} catch (error) {
			if (isNetworkError(error)) {
				console.warn(
					`[API] Network error, using mock for ${endpoint}. Set localStorage.setItem("useMock", "true") to always use mock.`
				);
				return getMockResponse(endpoint);
			}
			throw error;
		}
	}

	// Método para alternar entre mock e API real
	setUseMock(useMock: boolean) {
		this.useMock = useMock;
		if (typeof window !== "undefined") {
			if (useMock) {
				localStorage.setItem("useMock", "true");
			} else {
				localStorage.removeItem("useMock");
			}
		}
	}

	getUseMock(): boolean {
		return this.useMock;
	}
}

// instância global já com interceptors configurados
export const api = new Api();
