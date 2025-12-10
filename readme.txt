# 🛒 Sistema de Gestão de Feiras (Protótipo)

## 📄 Sobre o Projeto

Este sistema digital foi desenvolvido para facilitar a interação entre **consumidores** e **feirantes**, permitindo buscar produtos, comparar preços e localizar bancas dentro de uma feira.

O sistema possui três perfis de acesso:
- **Administrador:** Gerencia categorias, usuários e relatórios.
- **Feirantes:** Cadastram produtos, preços e informações da banca.
- **Usuários:** Pesquisam produtos e visualizam detalhes dos vendedores.

> **⚠️ Nota sobre o Protótipo**
>
> Este software é uma **versão inicial**, que implementa a base de cadastro de usuários, feirantes e produtos.  
> Algumas funcionalidades planejadas ainda **não estão disponíveis**, como:
> - Integração com GPS e cálculo de distâncias.
> - Filtros avançados (por localização, avaliação, proximidade).

---

## 🚀 Guia de Execução

Siga os passos abaixo para rodar o Backend e o Frontend localmente.

### 📦 1. Backend (API)

Abra o terminal e execute os comandos na ordem:

**1. Ativar o ambiente virtual**
```bash
source tp2-projeto-final/bin/activate

2. Instalar as dependências
Bash

pip install -r requirements.txt

3. Iniciar o servidor
Bash

python run.py

🎨 2. Frontend (Interface)

Mantenha o terminal do backend aberto e abra um novo terminal:

1. Acessar a pasta do frontend
Bash

cd frontend

2. Instalar as dependências
Bash

pnpm install

3. Rodar o servidor de desenvolvimento
Bash

pnpm run dev

🔗 3. Executando o Sistema Completo

Para utilizar o sistema, você deve manter dois terminais abertos simultaneamente:
Terminal	Função	Comando
🖥️ Terminal 1	Backend (API)	python run.py
🌐 Terminal 2	Frontend (UI)	pnpm run dev

Após iniciar ambos, acesse o link exibido no Terminal 2 em seu navegador.
