# 🛒 Sistema de Gestão de Feiras (Protótipo)

## 📄 Sobre o Projeto

Este sistema digital foi desenvolvido para facilitar a interação entre **consumidores** e **feirantes**, permitindo buscar produtos, comparar preços e localizar bancas dentro de uma feira.

O sistema possui três perfis de acesso:
- **Administrador:** Gerencia o sistema, define tipos de produtos permitidos e locais/posições GPS válidas. Gera relatórios de uso e popularidade.
- **Feirantes:** Cadastram seus produtos, definem preços, informam a localização da banca (endereço ou coordenadas) e observações.
- **Usuários:** Podem se cadastrar para salvar históricos, pesquisar produtos por nome, banca ou região, e visualizar preços e localizações. Também podem avaliar e comunicar-se com feirantes.

> **⚠️ Nota sobre o Protótipo**
> Este software é uma versão inicial. Funcionalidades como integração automática com GPS, filtros avançados de ordenação (distância/nota) e relatórios complexos **não estão implementadas**. O foco atual é a arquitetura base de cadastro e interação.

---

## 🚀 Guia de Execução

Copie e cole os comandos abaixo para configurar e rodar o projeto.

### ▶️ Comandos de Instalação e Execução

```bash
# ==========================================
#  PARTE 1: BACKEND (Terminal 1)
# ==========================================

# 1. Ativar o ambiente virtual
source tp2-projeto-final/bin/activate

# 2. Instalar dependências do backend
pip install -r requirements.txt

# 3. Iniciar o servidor backend
# (Este comando manterá o terminal ocupado. Não o feche.)
python run.py

# ==========================================
#  PARTE 2: FRONTEND (Abra um NOVO Terminal)
# ==========================================

# 4. Acessar a pasta do frontend
cd frontend

# 5. Instalar dependências do frontend
pnpm install

# 6. Rodar o servidor de desenvolvimento
pnpm run dev

# ==========================================
#  CONCLUSÃO
# ==========================================
# Com os dois comandos rodando (python run.py e pnpm run dev),
# acesse o link exibido no Terminal 2 (ex: http://localhost:5173).
