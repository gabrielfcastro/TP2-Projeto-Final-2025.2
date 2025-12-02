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

1. Adicione os dados mockados em `mocks/products.ts` (ou crie novos arquivos)
2. Adicione o roteamento no método `getMockResponse` em `utils/api.ts`

