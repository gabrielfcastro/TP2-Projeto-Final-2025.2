"""
Módulo para testes de inserção de usuários e feirantes no banco de dados.
"""

import sqlite3
from database_operations import DatabaseOperations


class TesteInsercao:
    """Classe para testar a inserção de dados no banco de dados."""

    def __init__(self, db_name='feira_livre.db'):
        """Inicializa a classe de teste.

        Args:
            db_name (str): Nome do arquivo do banco de dados. Padrão: 'feira_livre.db'
        """
        self.db_name = db_name
        self.db_ops = DatabaseOperations(db_name)

    def testar_conexao(self):
        """Testa a conexão com o banco de dados."""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
            tabelas = cursor.fetchall()
            conn.close()
            
            print("Conexão com o banco de dados estabelecida!")
            print(f"Tabelas encontradas: {len(tabelas)}")
            return True
            
        except Exception as error:
            print(f"Erro na conexão: {error}")
            return False

    def inserir_usuario_cliente(self):
        """Insere um usuário do tipo cliente."""
        try:
            usuario_data = {
                'email': 'xamuel_cliente@exemplo.com',
                'senha_hash': 'hash_senha_segura_123',
                'nome': 'Xamuel',
                'telefone': '(11) 99999-9999',
                'latitude': -23.550520,
                'longitude': -46.633308,
                'tipo': 'cliente'
            }
            
            usuario_id = self.db_ops.criar_usuario(usuario_data)
            print(f"Usuário cliente inserido com ID: {usuario_id}")
            return usuario_id
            
        except Exception as error:
            print(f"Erro ao inserir usuário cliente: {error}")
            return None

    def inserir_usuario_feirante(self):
        """Insere um usuário do tipo feirante."""
        try:
            usuario_data = {
                'email': 'feirante@exemplo.com',
                'senha_hash': 'hash_senha_segura_456',
                'nome': 'Maria Oliveira',
                'telefone': '(11) 98888-8888',
                'latitude': -23.551000,
                'longitude': -46.634000,
                'tipo': 'feirante'
            }
            
            usuario_id = self.db_ops.criar_usuario(usuario_data)
            print(f"Usuário feirante inserido com ID: {usuario_id}")
            return usuario_id
            
        except Exception as error:
            print(f"Erro ao inserir usuário feirante: {error}")
            return None

    def inserir_feirante(self, usuario_id):
        """Insere um feirante associado a um usuário.

        Args:
            usuario_id (int): ID do usuário feirante

        Returns:
            int: ID do feirante inserido ou None em caso de erro
        """
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
            INSERT INTO feirantes (
                usuario_id, nome_estabelecimento, descricao, 
                horario_funcionamento, dias_funcionamento
            ) VALUES (?, ?, ?, ?, ?)
            ''', (
                usuario_id,
                'Feira Orgânica da Maria',
                'Produtos orgânicos frescos direto do produtor',
                '07:00-13:00',
                'Segunda a Sábado'
            ))
            
            feirante_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            print(f"Feirante inserido com ID: {feirante_id}")
            return feirante_id
            
        except Exception as error:
            print(f"Erro ao inserir feirante: {error}")
            return None

    def inserir_produto(self, feirante_id, categoria_id=1):
        """Insere um produto de exemplo.

        Args:
            feirante_id (int): ID do feirante
            categoria_id (int): ID da categoria do produto

        Returns:
            int: ID do produto inserido ou None em caso de erro
        """
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            cursor.execute('''
            INSERT INTO produtos (
                feirante_id, nome, descricao, preco, quantidade_estoque,
                categoria_id, latitude, longitude
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            ''', (
                feirante_id,
                'Maçã Fuji Orgânica',
                'Maçãs Fuji orgânicas, doces e crocantes',
                8.50,
                100,
                categoria_id,
                -23.551000,
                -46.634000
            ))
            
            produto_id = cursor.lastrowid
            conn.commit()
            conn.close()
            
            print(f"Produto inserido com ID: {produto_id}")
            return produto_id
            
        except Exception as error:
            print(f"Erro ao inserir produto: {error}")
            return None

    def verificar_insercoes(self):
        """Verifica e exibe os dados inseridos."""
        try:
            conn = sqlite3.connect(self.db_name)
            cursor = conn.cursor()
            
            print("\n" + "="*60)
            print("VERIFICACAO DOS DADOS INSERIDOS")
            print("="*60)
            
            # Verificar usuários
            cursor.execute('''
            SELECT id, email, nome, tipo, ativo 
            FROM usuarios 
            ORDER BY id DESC 
            LIMIT 2
            ''')
            usuarios = cursor.fetchall()
            
            print("\nULTIMOS USUARIOS INSERIDOS:")
            for usuario in usuarios:
                print(f"  ID: {usuario[0]}, Email: {usuario[1]}, "
                      f"Nome: {usuario[2]}, Tipo: {usuario[3]}, "
                      f"Ativo: {usuario[4]}")
            
            # Verificar feirantes
            cursor.execute('''
            SELECT f.id, f.nome_estabelecimento, u.nome, f.ativo 
            FROM feirantes f 
            JOIN usuarios u ON f.usuario_id = u.id 
            ORDER BY f.id DESC 
            LIMIT 1
            ''')
            feirantes = cursor.fetchall()
            
            print("\nULTIMOS FEIRANTES INSERIDOS:")
            for feirante in feirantes:
                print(f"  ID: {feirante[0]}, Estabelecimento: {feirante[1]}, "
                      f"Proprietario: {feirante[2]}, Ativo: {feirante[3]}")
            
            # Verificar produtos
            cursor.execute('''
            SELECT p.id, p.nome, p.preco, p.quantidade_estoque, c.nome 
            FROM produtos p 
            JOIN categorias c ON p.categoria_id = c.id 
            ORDER BY p.id DESC 
            LIMIT 1
            ''')
            produtos = cursor.fetchall()
            
            print("\nULTIMOS PRODUTOS INSERIDOS:")
            for produto in produtos:
                print(f"  ID: {produto[0]}, Nome: {produto[1]}, "
                      f"Preço: R${produto[2]:.2f}, Estoque: {produto[3]}, "
                      f"Categoria: {produto[4]}")
            
            conn.close()
            
        except Exception as error:
            print(f"Erro ao verificar insercoes: {error}")

    def executar_testes_completos(self):
        """Executa todos os testes de inserção."""
        print("INICIANDO TESTES DE INSERCAO")
        print("="*50)
        
        # Testar conexão
        if not self.testar_conexao():
            return
        
        # Inserir usuários
        cliente_id = self.inserir_usuario_cliente()
        feirante_user_id = self.inserir_usuario_feirante()
        
        if feirante_user_id:
            # Inserir feirante
            feirante_id = self.inserir_feirante(feirante_user_id)
            
            if feirante_id:
                # Inserir produto
                self.inserir_produto(feirante_id)
        
        # Verificar todas as inserções
        self.verificar_insercoes()
        
        print("\nTESTES CONCLUIDOS!")


def main():
    """Função principal para executar os testes."""
    teste = TesteInsercao()
    teste.executar_testes_completos()


if __name__ == "__main__":
    main()