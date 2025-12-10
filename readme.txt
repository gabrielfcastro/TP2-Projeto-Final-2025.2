# 🛒 Sistema de Gestão de Feiras (Protótipo)

## 📄 Sobre o Projeto

Este sistema digital foi desenvolvido para facilitar a interação entre **consumidores** e **feirantes**, permitindo buscar produtos, comparar preços e localizar bancas dentro de uma feira.

O sistema possui três perfis de acesso:
- **Administrador:** Gerencia categorias, usuários e relatórios.
- **Feirantes:** Cadastram produtos, preços e informações da banca.
- **Usuários:** Pesquisam produtos e visualizam detalhes dos vendedores.

### ⚠️ Nota sobre o Protótipo
Este software é uma **versão inicial**, que implementa a base de cadastro de usuários, feirantes e produtos.  
Algumas funcionalidades planejadas ainda **não estão disponíveis**, como:
- Integração com GPS e cálculo de distâncias.
- Filtros avançados (por localização, avaliação, proximidade).

---

## 🚀 Guia de Execução

Siga os passos abaixo para rodar o Backend e o Frontend localmente.

---

## 📦 1. Backend (API)

No terminal, execute:

### ▶️ Ativar o ambiente virtual
```bash
source tp2-projeto-final/bin/activate

▶️ Instalar dependências

pip install -r requirements.txt

▶️ Iniciar o servidor

python run.py

🎨 2. Frontend (Interface)

Em um novo terminal:
▶️ Acessar a pasta do frontend

cd frontend

▶️ Instalar dependências

pnpm install

▶️ Rodar o servidor de desenvolvimento

pnpm run dev

🔗 3. Executando Backend + Frontend Juntos

Para utilizar o sistema completo, mantenha dois terminais abertos ao mesmo tempo:

    🖥️ Terminal 1: python run.py (Backend)

    🌐 Terminal 2: pnpm run dev (Frontend)

Após iniciar ambos, acesse no navegador o link exibido pelo terminal do Frontend.
