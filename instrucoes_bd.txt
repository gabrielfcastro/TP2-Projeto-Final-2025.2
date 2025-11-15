# Sistema Feira Livre - Banco de Dados

## Tabelas do Sistema

usuarios - Cadastro de clientes e feirantes

feirantes - Estabelecimentos cadastrados

produtos - Itens disponíveis para venda

categorias - Categorias de produtos

pedidos - Registro de compras

carrinhos - Carrinhos de compra

avaliacoes_feirantes - Avaliações dos feirantes

avaliacoes_produtos - Avaliações dos produtos

mensagens - Sistema de mensagens

historico_buscas - Histórico de buscas

log_acoes - Log de atividades

## create_database.py
Cria o banco de dados SQLite feira_livre.db

Configura todas as tabelas do sistema

Cria índices para otimização

Insere categorias de exemplo

## database_operations.py
Operações básicas de CRUD no banco

Gerencia usuários, produtos, carrinhos

Buscas por localização e email

## teste_insercao.py
Testa a conexão com o banco

Insere dados de exemplo para demonstração

Verifica se todas as funcionalidades estão funcionando
