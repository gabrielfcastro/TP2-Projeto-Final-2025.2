// utils/api.ts
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { getMockResponse } from "./mockHandler";

interface MockConfig extends AxiosRequestConfig {
	__isMock?: boolean;
}

interface ApiResponse {
	redirect_url?: string;
	[key: string]: unknown;
}

let cachedToken: string | null = null;
let tokenPromise: Promise<string | null> | null = null;

export function clearCachedToken() {
	cachedToken = null;
	tokenPromise = null;
}

const baseURL =
	process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000/api";

function getUseMock(): boolean {
	return (
		process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
		(typeof window !== "undefined" &&
			localStorage.getItem("useMock") === "true")
	);
}

async function getToken(): Promise<string | null> {
	if (cachedToken) {
		return cachedToken;
	}

	if (!tokenPromise) {
		tokenPromise = Promise.resolve(
			typeof window !== "undefined"
				? localStorage.getItem("token")
				: process.env.NEXT_PUBLIC_API_TOKEN || null
		).then((token) => {
			cachedToken = token;
			return token;
		});
	}

	const token = await tokenPromise;
	tokenPromise = null;

	return token;
}

// Função para obter dados mockados
async function getMockData<T>(endpoint: string): Promise<T> {
	const response = await getMockResponse(endpoint);
	return (await response.json()) as T;
}

const api = axios.create({
	baseURL,
	headers: {
		"Content-Type": "application/json",
	},
});

// Interceptor de request
api.interceptors.request.use(
	async (config) => {
		if (getUseMock()) {
			console.log(
				`[MOCK] ${config.method?.toUpperCase() || "GET"} ${config.url}`
			);
			// Para mock, não fazemos a requisição real
			// Retornamos um config especial que será tratado no interceptor de response
			(config as MockConfig).__isMock = true;
			return config;
		}

		const token = await getToken();
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);

// Interceptor de response
api.interceptors.response.use(
	(response: AxiosResponse) => {
		// Se for mock, substitui a resposta
		if ((response.config as MockConfig).__isMock) {
			return getMockData(response.config.url || "").then((data) => ({
				...response,
				data,
			}));
		}

		// Verifica redirect_url na resposta
		const apiResponse = response.data as ApiResponse;
		if (apiResponse?.redirect_url && typeof window !== "undefined") {
			window.location.href = apiResponse.redirect_url;
		}

		return response;
	},
	async (error: AxiosError) => {
		// Se for mock, retorna dados mockados mesmo em caso de erro
		if ((error.config as MockConfig)?.__isMock) {
			const data = await getMockData(error.config?.url || "");
			return Promise.resolve({
				...error.response,
				data,
			} as AxiosResponse);
		}

		// Trata redirect_url em erros
		const errorData = error.response?.data as ApiResponse | undefined;
		const redirectUrl = errorData?.redirect_url;

		if (redirectUrl && typeof window !== "undefined") {
			window.location.href = redirectUrl;
		}

		// Trata 401
		if (error.response?.status === 401) {
			clearCachedToken();
			if (typeof window !== "undefined") {
				window.location.href = "/agente/login";
			}
		}

		// Se for erro de rede, tenta usar mock
		if (
			!error.response &&
			(error.code === "ERR_NETWORK" ||
				error.message.includes("Network Error"))
		) {
			console.warn(
				`[API] Network error, using mock for ${error.config?.url}. Set localStorage.setItem("useMock", "true") to always use mock.`
			);
			const data = await getMockData(error.config?.url || "");
			return Promise.resolve({
				data,
				status: 200,
				statusText: "OK",
				headers: {},
				config: error.config || {},
			} as AxiosResponse);
		}

		return Promise.reject(error);
	}
);

// Funções auxiliares para mock
export function setUseMock(useMock: boolean) {
	if (typeof window !== "undefined") {
		if (useMock) {
			localStorage.setItem("useMock", "true");
		} else {
			localStorage.removeItem("useMock");
		}
	}
}

export { getUseMock };

export default api;
