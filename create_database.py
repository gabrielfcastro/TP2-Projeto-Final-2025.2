"""
Módulo de criação do banco de dados para sistema de compras baseado em geolocalização.

Este módulo cria todas as tabelas necessárias para o sistema de feirantes e produtos.
"""

import sqlite3


class CriadorBancoDados:
    """Classe responsável pela criação do banco de dados e tabelas do sistema."""
    
    def __init__(self, nome_banco='banco.db'):
        """
        Inicializa o criador do banco de dados.
        
        Args:
            nome_banco (str): Nome do arquivo do banco de dados SQLite
        """
        self.nome_banco = nome_banco
        self.conexao = None
        self.cursor = None

    def conectar(self):
        """
        Estabelece conexão com o banco de dados.
        
        Returns:
            bool: True se conexão foi bem sucedida, False caso contrário
        """
        try:
            self.conexao = sqlite3.connect(self.nome_banco)
            self.cursor = self.conexao.cursor()
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao conectar com o banco: {erro}")
            return False

    def criar_tabela_usuarios(self):
        """
        Cria a tabela de usuários no banco de dados.
        
        EU001 - Eu como administrador quero cadastrar usuários para gerenciar o sistema
        """
        try:
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS usuarios (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email VARCHAR UNIQUE NOT NULL,
                    senha VARCHAR NOT NULL,
                    nome VARCHAR NOT NULL,
                    latitude DECIMAL(10,6),
                    longitude DECIMAL(10,6)
                )
            ''')
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao criar tabela usuarios: {erro}")
            return False

    def criar_tabela_feirantes(self):
        """
        Cria a tabela de feirantes no banco de dados.
        
        EU002 - Eu como feirante quero me cadastrar no sistema para vender meus produtos
        """
        try:
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS feirantes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    usuario_id INTEGER,
                    nome_estabelecimento VARCHAR NOT NULL,
                    avaliacao_media DECIMAL(3,2) DEFAULT 0.00,
                    total_avaliacoes INTEGER DEFAULT 0,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
                )
            ''')
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao criar tabela feirantes: {erro}")
            return False

    def criar_tabela_produtos(self):
        """
        Cria a tabela de produtos no banco de dados.
        
        EU003 - Eu como feirante quero cadastrar produtos para oferecê-los aos clientes
        """
        try:
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS produtos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    feirante_id INTEGER,
                    nome VARCHAR NOT NULL,
                    descricao TEXT,
                    preco DECIMAL(10,2) NOT NULL,
                    latitude DECIMAL(10,6),
                    longitude DECIMAL(10,6),
                    avaliacao_media DECIMAL(3,2) DEFAULT 0.00,
                    total_avaliacoes INTEGER DEFAULT 0,
                    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (feirante_id) REFERENCES feirantes(id)
                )
            ''')
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao criar tabela produtos: {erro}")
            return False

    def criar_tabela_avaliacoes_feirantes(self):
        """
        Cria a tabela de avaliações de feirantes.
        
        EU004 - Eu como cliente quero avaliar feirantes para compartilhar minha experiência
        """
        try:
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS avaliacoes_feirantes (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    feirante_id INTEGER,
                    usuario_id INTEGER,
                    nota DECIMAL(2,1) NOT NULL,
                    comentario TEXT,
                    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (feirante_id) REFERENCES feirantes(id),
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
                )
            ''')
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao criar tabela avaliacoes_feirantes: {erro}")
            return False

    def criar_tabela_avaliacoes_produtos(self):
        """
        Cria a tabela de avaliações de produtos.
        
        EU005 - Eu como cliente quero avaliar produtos para ajudar outros compradores
        """
        try:
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS avaliacoes_produtos (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    produto_id INTEGER,
                    usuario_id INTEGER,
                    nota DECIMAL(2,1) NOT NULL,
                    comentario TEXT,
                    data_avaliacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (produto_id) REFERENCES produtos(id),
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
                )
            ''')
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao criar tabela avaliacoes_produtos: {erro}")
            return False

    def criar_tabela_historico_buscas(self):
        """
        Cria a tabela de histórico de buscas.
        
        EU006 - Eu como sistema quero armazenar histórico de buscas para melhorar recomendações
        """
        try:
            self.cursor.execute('''
                CREATE TABLE IF NOT EXISTS historico_buscas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    usuario_id INTEGER,
                    produto_buscado VARCHAR NOT NULL,
                    feirante_buscado VARCHAR NOT NULL,
                    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
                )
            ''')
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao criar tabela historico_buscas: {erro}")
            return False

    def criar_banco_completo(self):
        """
        Cria todas as tabelas do banco de dados.
        
        Returns:
            bool: True se todas as tabelas foram criadas com sucesso, False caso contrário
        """
        if not self.conectar():
            return False

        try:
            # Lista de métodos para criar tabelas
            metodos_criacao = [
                self.criar_tabela_usuarios,
                self.criar_tabela_feirantes,
                self.criar_tabela_produtos,
                self.criar_tabela_avaliacoes_feirantes,
                self.criar_tabela_avaliacoes_produtos,
                self.criar_tabela_historico_buscas
            ]

            # Executa todos os métodos de criação
            for metodo in metodos_criacao:
                if not metodo():
                    return False

            self.conexao.commit()
            print("Banco de dados criado com sucesso!")
            return True

        except sqlite3.Error as erro:
            print(f"Erro ao criar banco de dados: {erro}")
            return False
        finally:
            self.fechar_conexao()

    def fechar_conexao(self):
        """Fecha a conexão com o banco de dados."""
        if self.conexao:
            self.conexao.close()


def main():
    """
    Função principal para criação do banco de dados.
    
    EU007 - Eu como administrador quero inicializar o banco de dados para preparar o sistema
    """
    criador = CriadorBancoDados()
    
    if criador.criar_banco_completo():
        print("Sistema de banco de dados inicializado com sucesso!")
    else:
        print("Erro ao inicializar o banco de dados.")


if __name__ == "__main__":
    main()