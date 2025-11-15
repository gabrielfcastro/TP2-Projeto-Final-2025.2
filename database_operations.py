"""
Módulo para operações no banco de dados do sistema de feira livre.
"""

import sqlite3


class DatabaseOperations:
    """Classe para operações no banco de dados."""

    def __init__(self, db_name='feira_livre.db'):
        """Inicializa a classe de operações do banco de dados.

        Args:
            db_name (str): Nome do arquivo do banco de dados. Padrão: 'feira_livre.db'
        """
        self.db_name = db_name

    def get_connection(self):
        """Retorna uma conexão com o banco de dados.

        Returns:
            sqlite3.Connection: Conexão com o banco de dados
        """
        conn = sqlite3.connect(self.db_name)
        conn.execute("PRAGMA foreign_keys = ON")
        return conn

    def criar_usuario(self, usuario_data):
        """Cria um novo usuário no banco de dados.

        Args:
            usuario_data (dict): Dicionário com os dados do usuário:
                - email (str): Email do usuário
                - senha_hash (str): Hash da senha do usuário
                - nome (str): Nome do usuário
                - telefone (str, optional): Telefone do usuário
                - latitude (float, optional): Latitude da localização
                - longitude (float, optional): Longitude da localização
                - tipo (str, optional): Tipo do usuário. Padrão: 'cliente'

        Returns:
            int: ID do usuário criado

        Raises:
            ValueError: Se email já estiver cadastrado
            RuntimeError: Se ocorrer erro ao criar usuário
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cursor.execute('''
            INSERT INTO usuarios (email, senha_hash, nome, telefone, latitude, longitude, tipo)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                usuario_data['email'],
                usuario_data['senha_hash'],
                usuario_data['nome'],
                usuario_data.get('telefone'),
                usuario_data.get('latitude'),
                usuario_data.get('longitude'),
                usuario_data.get('tipo', 'cliente')
            ))

            user_id = cursor.lastrowid
            conn.commit()
            conn.close()

            return user_id
        except sqlite3.IntegrityError as exc:
            raise ValueError("Email já cadastrado") from exc
        except Exception as exc:
            raise RuntimeError(f"Erro ao criar usuário: {exc}") from exc

    def buscar_usuario_por_email(self, email):
        """Busca um usuário pelo email.

        Args:
            email (str): Email do usuário a ser buscado

        Returns:
            tuple: Dados do usuário encontrado ou None se não encontrado

        Raises:
            RuntimeError: Se ocorrer erro na busca
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            cursor.execute('SELECT * FROM usuarios WHERE email = ?', (email,))
            usuario = cursor.fetchone()

            conn.close()
            return usuario
        except Exception as exc:
            raise RuntimeError(f"Erro ao buscar usuário: {exc}") from exc

    def buscar_produtos_por_localizacao(self, latitude, longitude,
                                        raio_km=10, categoria_id=None):
        """Busca produtos por localização (simulação de busca por proximidade).

        Args:
            latitude (float): Latitude da localização de busca
            longitude (float): Longitude da localização de busca
            raio_km (int, optional): Raio de busca em km. Defaults to 10.
            categoria_id (int, optional): ID da categoria para filtrar. Defaults to None.

        Returns:
            list: Lista de produtos encontrados

        Raises:
            RuntimeError: Se ocorrer erro na busca
        """
        # Parâmetros não utilizados para futura implementação de busca por proximidade
        _ = latitude, longitude, raio_km  # Marcados como não utilizados

        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            query = '''
            SELECT p.*, f.nome_estabelecimento, c.nome as categoria_nome
            FROM produtos p
            JOIN feirantes f ON p.feirante_id = f.id
            JOIN categorias c ON p.categoria_id = c.id
            WHERE p.ativo = 1 AND f.ativo = 1
            '''

            params = []

            if categoria_id:
                query += ' AND p.categoria_id = ?'
                params.append(categoria_id)

            query += ' ORDER BY p.avaliacao_media DESC'

            cursor.execute(query, params)
            produtos = cursor.fetchall()
            conn.close()

            return produtos
        except Exception as exc:
            raise RuntimeError(f"Erro ao buscar produtos: {exc}") from exc

    def adicionar_ao_carrinho(self, usuario_id, produto_id, quantidade):
        """Adiciona um produto ao carrinho do usuário.

        Args:
            usuario_id (int): ID do usuário
            produto_id (int): ID do produto
            quantidade (int): Quantidade a ser adicionada

        Returns:
            bool: True se a operação foi bem sucedida

        Raises:
            RuntimeError: Se ocorrer erro ao adicionar ao carrinho
        """
        try:
            conn = self.get_connection()
            cursor = conn.cursor()

            # Verificar se o usuário já tem um carrinho
            cursor.execute(
                'SELECT id FROM carrinhos WHERE usuario_id = ?',
                (usuario_id,)
            )
            carrinho = cursor.fetchone()

            if not carrinho:
                # Criar carrinho se não existir
                cursor.execute(
                    'INSERT INTO carrinhos (usuario_id) VALUES (?)',
                    (usuario_id,)
                )
                carrinho_id = cursor.lastrowid
            else:
                carrinho_id = carrinho[0]

            # Adicionar item ao carrinho
            cursor.execute('''
            INSERT OR REPLACE INTO itens_carrinho (carrinho_id, produto_id, quantidade)
            VALUES (?, ?, COALESCE((SELECT quantidade FROM itens_carrinho
            WHERE carrinho_id = ? AND produto_id = ?), 0) + ?)
            ''', (carrinho_id, produto_id, carrinho_id, produto_id, quantidade))

            conn.commit()
            conn.close()

            return True
        except Exception as exc:
            raise RuntimeError(f"Erro ao adicionar ao carrinho: {exc}") from exc


# Exemplo de uso
if __name__ == "__main__":
    # Criar o banco de dados
    from create_database import main as create_db_main
    create_db_main()