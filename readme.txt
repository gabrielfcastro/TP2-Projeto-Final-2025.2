# 🛒 Sistema de Gestão de Feiras (Protótipo)

## 📄 Sobre o Projeto

Este projeto consiste em um sistema digital desenvolvido para facilitar a interação entre consumidores e feirantes. O objetivo da plataforma é permitir que usuários encontrem produtos em feiras, comparem preços e localizem bancas específicas.

O sistema contempla três perfis de acesso:
* **Administrador:** Gerencia o sistema, categorias de produtos e relatórios.
* **Feirantes (Fornecedores):** Cadastram seus produtos, definem preços e informações da banca.
* **Usuários:** Podem pesquisar produtos e visualizar informações dos vendedores.

### ⚠️ Nota sobre o Protótipo
Este software é uma **versão de protótipo**. Embora a arquitetura base para cadastro de usuários, feirantes e produtos esteja funcional, algumas funcionalidades planejadas para a versão final **não estão implementadas neste momento**, especificamente:
* Integração com GPS e cálculos de distância.
* Filtros avançados de ordenação (por localização ou nota).

---

## 🚀 Guia de Execução

Siga os passos abaixo para rodar o Backend e o Frontend localmente.

### 📦 1. Backend (API)

Abra o seu terminal e siga os comandos:

1.  **Ativar o ambiente virtual**
    ```bash
    source tp2-projeto-final/bin/activate
    ```

2.  **Instalar as dependências**
    ```bash
    pip install -r requirements.txt
    ```

3.  **Iniciar o servidor**
    ```bash
    python run.py
    ```

### 🎨 2. Frontend (Interface)

Em um **novo terminal**, execute:

1.  **Entrar na pasta do frontend**
    ```bash
    cd frontend
    ```

2.  **Instalar dependências**
    ```bash
    pnpm install
    ```

3.  **Rodar o servidor de desenvolvimento**
    ```bash
    pnpm run dev
    ```

---

### 🔗 3. Executando Backend + Frontend Simultaneamente

Para utilizar o sistema completo, você precisará manter dois terminais abertos rodando ao mesmo tempo:

* **🖥️ Terminal 1:** `python run.py` (Backend)
* **🌐 Terminal 2:** `pnpm run dev` (Frontend)

Após iniciar ambos, acesse o link fornecido pelo terminal do Frontend no seu navegador.
