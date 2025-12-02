// utils/api.ts
type RequestInterceptor = (
  url: string,
  options: RequestInit,
) => Promise<void> | void;
type ResponseInterceptor = (response: Response) => Promise<void> | void;

class Api {
  private baseUrl: string;
  private defaultHeaders: Record<string, string> = {};
  private requestInterceptors: RequestInterceptor[] = [];
  private responseInterceptors: ResponseInterceptor[] = [];

  constructor() {
    const baseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:5000/api";
    this.baseUrl = baseUrl;

    // interceptors globais já definidos aqui
    this.addRequestInterceptor(async (url, options) => {
      // ex: adicionar token JWT automaticamente
      const token = localStorage.getItem("token");
      if (token) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${token}`,
        };
      }
    });

    this.addResponseInterceptor((response) => {
      // ex: log ou refresh token
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
    options: RequestInit = {},
  ): Promise<Response> {
    const url = `${this.baseUrl}${endpoint}`;
    const requestOptions: RequestInit = {
      ...options,
      headers: { ...this.defaultHeaders, ...(options.headers || {}) },
    };

    for (const interceptor of this.requestInterceptors) {
      await interceptor(url, requestOptions);
    }

    const response = await fetch(url, requestOptions);

    for (const interceptor of this.responseInterceptors) {
      await interceptor(response);
    }

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`API request failed: ${response.status} ${text}`);
    }

    return response;
  }
}

// instância global já com interceptors configurados
export const api = new Api();
