# 🛒🥬 Sistema de Gestão de Feiras (Protótipo)

Este sistema digital foi desenvolvido para facilitar a interação entre **consumidores** e **feirantes**, permitindo buscar produtos, comparar preços e localizar bancas dentro de uma feira de forma ágil e centralizada.

## 📋 Visão Geral

O projeto consiste em uma plataforma com três perfis de acesso distintos, focada na arquitetura base de cadastro e interação comercial, servindo como base para futuras implementações de geolocalização.

## 👥 Perfis e Funcionalidades

### 🛡️ Administrador

* Gerencia o sistema e usuários.
* Define tipos de produtos permitidos.
* Gera relatórios de uso e popularidade.

### 🏪 Feirantes (Fornecedores)

* Cadastram produtos e definem preços.
* Informam a localização da banca (endereço ou coordenadas).
* Inserem observações sobre suas vendas.

### 📱 Usuários (Consumidores)

* Pesquisam produtos por nome, banca ou região.
* Visualizam preços e localizações.
* Avaliam e comunicam-se com feirantes.

## ⚠️ Status do Protótipo

> **Versão Inicial:** Este software implementa a arquitetura base. Funcionalidades como **integração automática com GPS**, filtros avançados (distância/nota) e relatórios complexos **não estão implementadas** nesta etapa.

## 🚀 Guia de Execução

Copie e cole o bloco de comandos abaixo no seu terminal para configurar e rodar todo o sistema (Backend + Frontend) sequencialmente.

```bash
# --- 📦 PARTE 1: BACKEND (Terminal 1) ---

# 1. Ativar o ambiente virtual
source tp2-projeto-final/bin/activate

# 2. Instalar dependências do backend
pip install -r requirements.txt

# 3. Iniciar o servidor backend (Mantenha este terminal aberto)
python run.py

# --- 🎨 PARTE 2: FRONTEND (Abra um NOVO Terminal) ---

# 4. Acessar a pasta do frontend
cd frontend

# 5. Instalar dependências do frontend
pnpm install

# 6. Rodar o servidor de desenvolvimento
pnpm run dev

# ✅ TUDO PRONTO!
# Acesse o link exibido no Terminal 2.
