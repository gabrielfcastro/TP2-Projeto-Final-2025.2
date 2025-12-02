# Mock de Dados da API

Este diretório contém dados mockados para desenvolvimento quando a API não está disponível.

## Como usar o modo Mock

### Opção 1: Variável de Ambiente

Crie um arquivo `.env.local` na raiz do projeto `frontend`:

```env
NEXT_PUBLIC_USE_MOCK=true
```

### Opção 2: LocalStorage (no navegador)

Abra o console do navegador e execute:

```javascript
// Ativar mock
localStorage.setItem("useMock", "true");

// Desativar mock
localStorage.removeItem("useMock");

// Recarregue a página para aplicar
```

### Opção 3: Programaticamente

```typescript
import { api } from "@/utils/api";

// Ativar mock
api.setUseMock(true);

// Desativar mock
api.setUseMock(false);

// Verificar status
console.log(api.getUseMock());
```

## Endpoints Mockados

- `GET /produtos` - Retorna lista de produtos mockados
- `GET /produtos/:id` - Retorna um produto específico por ID

## Adicionar novos mocks

### Passo 1: Criar dados mockados

Crie ou edite um arquivo em `mocks/` com seus dados mockados:

```typescript
// mocks/example.ts
export const mockExamples = [
	{ id: 1, name: "Example 1" },
	{ id: 2, name: "Example 2" },
];

export const getMockExample = (id: number) => {
	return mockExamples.find((item) => item.id === id);
};
```

### Passo 2: Adicionar roteamento

Edite `utils/mockHandler.ts` e adicione o roteamento no método `getMockResponse`:

```typescript
// utils/mockHandler.ts
export async function getMockResponse(endpoint: string): Promise<Response> {
	await new Promise((resolve) => setTimeout(resolve, 300));

	let mockData: unknown;

	// Endpoints existentes
	if (endpoint === "/produtos" || endpoint === "/produtos/") {
		const { mockProducts } = await import("@/mocks/products");
		mockData = mockProducts;
	} else if (endpoint.match(/^\/produtos\/\d+$/)) {
		// ... código existente
	}
	// Adicione seu novo endpoint aqui
	else if (endpoint === "/examples" || endpoint === "/examples/") {
		const { mockExamples } = await import("@/mocks/example");
		mockData = mockExamples;
	} else if (endpoint.match(/^\/examples\/\d+$/)) {
		const id = parseInt(endpoint.split("/").pop() || "0", 10);
		const { getMockExample } = await import("@/mocks/example");
		const example = getMockExample(id);
		if (!example) {
			return new Response(JSON.stringify({ error: "Example not found" }), {
				status: 404,
				statusText: "Not Found",
				headers: { "Content-Type": "application/json" },
			});
		}
		mockData = example;
	} else {
		mockData = { message: "Mock endpoint not implemented", endpoint };
	}

	return new Response(JSON.stringify(mockData), {
		status: 200,
		statusText: "OK",
		headers: { "Content-Type": "application/json" },
	});
}
```

### Estrutura de arquivos

```
frontend/
├── mocks/
│   ├── products.ts      # Dados mockados de produtos
│   ├── example.ts       # Seus novos dados mockados
│   └── README.md        # Esta documentação
└── utils/
    ├── api.ts           # Cliente API principal
    └── mockHandler.ts  # Lógica de roteamento de mocks
```

### Notas

- O delay de 300ms é simulado automaticamente para simular latência de rede
- Endpoints não implementados retornam um objeto com `message` e `endpoint`
- Use imports dinâmicos (`await import()`) para melhor performance
