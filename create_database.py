"""
Módulo para criação e gerenciamento do banco de dados SQLite para o sistema de feira livre.
"""

import sqlite3


class DatabaseManager:
    """Classe para gerenciar a criação e conexão com o banco de dados SQLite."""

    def __init__(self, db_name='feira_livre.db'):
        """Inicializa o gerenciador do banco de dados.

        Args:
            db_name (str): Nome do arquivo do banco de dados. Padrão: 'feira_livre.db'
        """
        self.db_name = db_name
        self.conn = None

    def connect(self):
        """Conecta ao banco de dados SQLite.

        Returns:
            bool: True se a conexão foi bem sucedida, False caso contrário
        """
        try:
            self.conn = sqlite3.connect(self.db_name)
            # Ativa chaves estrangeiras
            self.conn.execute("PRAGMA foreign_keys = ON")
            print(f"Conectado ao banco de dados: {self.db_name}")
            return True
        except sqlite3.Error as error:
            print(f"Erro ao conectar ao banco de dados: {error}")
            return False

    def create_tables(self):
        """Cria todas as tabelas do banco de dados.

        Returns:
            bool: True se as tabelas foram criadas com sucesso, False caso contrário
        """
        if not self.conn:
            print("Não há conexão com o banco de dados")
            return False

        try:
            cursor = self.conn.cursor()

            # Tabela usuarios
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS usuarios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email VARCHAR(255) NOT NULL UNIQUE,
                senha_hash VARCHAR(255) NOT NULL,
                nome VARCHAR(255) NOT NULL,
                telefone VARCHAR(20),
                latitude DECIMAL(10,6),
                longitude DECIMAL(10,6),
                tipo VARCHAR(50) NOT NULL,
                ativo BOOLEAN DEFAULT 1,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
            ''')

            # Tabela feirantes
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS feirantes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                nome_estabelecimento VARCHAR(255) NOT NULL,
                descricao TEXT,
                horario_funcionamento VARCHAR(100),
                dias_funcionamento VARCHAR(100),
                avaliacao_media DECIMAL(3,2) DEFAULT 0.0,
                total_avaliacoes INTEGER DEFAULT 0,
                ativo BOOLEAN DEFAULT 1,
                FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
            )
            ''')

            # Tabela categorias
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS categorias (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome VARCHAR(255) NOT NULL UNIQUE,
                descricao TEXT
            )
            ''')

            # Tabela produtos
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                feirante_id INTEGER NOT NULL,
                nome VARCHAR(255) NOT NULL,
                descricao TEXT,
                preco DECIMAL(10,2) NOT NULL,
                quantidade_estoque INTEGER DEFAULT 0,
                categoria_id INTEGER NOT NULL,
                latitude DECIMAL(10,6),
                longitude DECIMAL(10,6),
                avaliacao_media DECIMAL(3,2) DEFAULT 0.0,
                total_avaliacoes INTEGER DEFAULT 0,
                ativo BOOLEAN DEFAULT 1,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (feirante_id) REFERENCES feirantes (id) ON DELETE CASCADE,
                FOREIGN KEY (categoria_id) REFERENCES categorias (id)
            )
            ''')

            # Tabela avaliacoes_feirantes
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS avaliacoes_feirantes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                feirante_id INTEGER NOT NULL,
                usuario_id INTEGER NOT NULL,
                nota DECIMAL(2,1) NOT NULL CHECK (nota >= 0 AND nota <= 5),
                comentario TEXT,
                data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (feirante_id) REFERENCES feirantes (id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
                UNIQUE(feirante_id, usuario_id)
            )
            ''')

            # Tabela avaliacoes_produtos
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS avaliacoes_produtos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                produto_id INTEGER NOT NULL,
                usuario_id INTEGER NOT NULL,
                nota DECIMAL(2,1) NOT NULL CHECK (nota >= 0 AND nota <= 5),
                comentario TEXT,
                data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE CASCADE,
                FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
                UNIQUE(produto_id, usuario_id)
            )
            ''')

            # Tabela mensagens
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS mensagens (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                remetente_id INTEGER NOT NULL,
                destinatario_id INTEGER NOT NULL,
                produto_id INTEGER,
                mensagem TEXT NOT NULL,
                lida BOOLEAN DEFAULT 0,
                data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (remetente_id) REFERENCES usuarios (id) ON DELETE CASCADE,
                FOREIGN KEY (destinatario_id) REFERENCES usuarios (id) ON DELETE CASCADE,
                FOREIGN KEY (produto_id) REFERENCES produtos (id) ON DELETE SET NULL
            )
            ''')

            # Tabela pedidos
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS pedidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL,
                feirante_id INTEGER NOT NULL,
                numero_pedido VARCHAR(100) UNIQUE NOT NULL,
                status VARCHAR(50) NOT NULL,
                valor_total DECIMAL(10,2) NOT NULL,
                metodo_pagamento VARCHAR(50) NOT NULL,
                status_pagamento VARCHAR(50) NOT NULL,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios (id),
                FOREIGN KEY (feirante_id) REFERENCES feirantes (id)
            )
            ''')

            # Tabela itens_pedido
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS itens_pedido (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                pedido_id INTEGER NOT NULL,
                produto_id INTEGER NOT NULL,
                quantidade INTEGER NOT NULL,
                preco_unitario DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (pedido_id) REFERENCES pedidos (id) ON DELETE CASCADE,
                FOREIGN KEY (produto_id) REFERENCES produtos (id)
            )
            ''')

            # Tabela carrinhos
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS carrinhos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER NOT NULL UNIQUE,
                data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE CASCADE
            )
            ''')

            # Tabela itens_carrinho
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS itens_carrinho (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                carrinho_id INTEGER NOT NULL,
                produto_id INTEGER NOT NULL,
                quantidade INTEGER NOT NULL,
                FOREIGN KEY (carrinho_id) REFERENCES carrinhos (id) ON DELETE CASCADE,
                FOREIGN KEY (produto_id) REFERENCES produtos (id),
                UNIQUE(carrinho_id, produto_id)
            )
            ''')

            # Tabela historico_buscas
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS historico_buscas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER,
                termo_busca VARCHAR(255) NOT NULL,
                latitude DECIMAL(10,6),
                longitude DECIMAL(10,6),
                data_busca TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
            )
            ''')

            # Tabela log_acoes
            cursor.execute('''
            CREATE TABLE IF NOT EXISTS log_acoes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                usuario_id INTEGER,
                acao VARCHAR(255) NOT NULL,
                detalhes TEXT,
                data_acao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                ip_address VARCHAR(45),
                FOREIGN KEY (usuario_id) REFERENCES usuarios (id) ON DELETE SET NULL
            )
            ''')

            self.conn.commit()
            print("Todas as tabelas foram criadas com sucesso!")
            return True

        except sqlite3.Error as error:
            print(f"Erro ao criar tabelas: {error}")
            return False

    def insert_sample_data(self):
        """Insere alguns dados de exemplo para teste."""
        try:
            cursor = self.conn.cursor()

            # Inserir categorias de exemplo
            categorias = [
                ('Frutas', 'Frutas frescas e variadas'),
                ('Verduras', 'Verduras e legumes frescos'),
                ('Laticínios', 'Queijos, iogurtes e derivados do leite'),
                ('Padaria', 'Pães, bolos e produtos de padaria'),
                ('Orgânicos', 'Produtos cultivados sem agrotóxicos')
            ]

            cursor.executemany(
                'INSERT OR IGNORE INTO categorias (nome, descricao) VALUES (?, ?)',
                categorias
            )

            self.conn.commit()
            print("Dados de exemplo inseridos com sucesso!")

        except sqlite3.Error as error:
            print(f"Erro ao inserir dados de exemplo: {error}")

    def create_indexes(self):
        """Cria índices para melhorar performance."""
        try:
            cursor = self.conn.cursor()

            # Índices para tabela usuarios
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_usuarios_tipo ON usuarios(tipo)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_usuarios_localizacao ON usuarios(latitude, longitude)'
            )

            # Índices para tabela produtos
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_produtos_feirante ON produtos(feirante_id)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_produtos_categoria ON produtos(categoria_id)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_produtos_preco ON produtos(preco)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_produtos_avaliacao ON produtos(avaliacao_media)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_produtos_localizacao ON produtos(latitude, longitude)'
            )

            # Índices para tabela pedidos
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_pedidos_usuario ON pedidos(usuario_id)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_pedidos_feirante ON pedidos(feirante_id)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_pedidos_status ON pedidos(status)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_pedidos_data ON pedidos(data_criacao)'
            )

            # Índices para outras tabelas
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_avaliacoes_feirante ON avaliacoes_feirantes(feirante_id)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_avaliacoes_produto ON avaliacoes_produtos(produto_id)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_mensagens_remetente ON mensagens(remetente_id)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_mensagens_destinatario ON mensagens(destinatario_id)'
            )
            cursor.execute(
                'CREATE INDEX IF NOT EXISTS idx_historico_usuario ON historico_buscas(usuario_id)'
            )

            self.conn.commit()
            print("Índices criados com sucesso!")

        except sqlite3.Error as error:
            print(f"Erro ao criar índices: {error}")

    def close(self):
        """Fecha a conexão com o banco de dados."""
        if self.conn:
            self.conn.close()
            print("Conexão com o banco de dados fechada")


def main():
    """Função principal para criar o banco de dados."""
    db_manager = DatabaseManager()

    if db_manager.connect():
        # Criar tabelas
        if db_manager.create_tables():
            # Criar índices
            db_manager.create_indexes()

            # Inserir dados de exemplo (opcional)
            inserir_exemplo = input(
                "Deseja inserir dados de exemplo? (s/n): "
            ).lower().strip()
            if inserir_exemplo == 's':
                db_manager.insert_sample_data()

        # Fechar conexão
        db_manager.close()


if __name__ == "__main__":
    main()