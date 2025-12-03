"""
Módulo de testes para inserir dados de exemplo no banco do sistema de feirantes.
"""

import sqlite3


class InseridorDadosTeste:
    """Classe para inserir dados de teste no banco de dados."""
    
    def __init__(self, nome_banco='banco.db'):
        self.nome_banco = nome_banco
        self.conexao = None
        self.cursor = None

    def conectar(self):
        """Estabelece conexão com o banco de dados."""
        try:
            self.conexao = sqlite3.connect(self.nome_banco)
            self.cursor = self.conexao.cursor()
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao conectar com o banco: {erro}")
            return False

    def inserir_usuarios(self):
        """Insere usuários de teste."""
        try:
            usuarios = [
                ('cliente@email.com', 'senha123', 'João Cliente', 'cliente', -23.550520, -46.633308),
                ('feirante@email.com', 'senha123', 'Maria Feirante', 'feirante', -23.551520, -46.634308),
                ('cliente2@email.com', 'senha123', 'Ana Silva', 'cliente', -23.552520, -46.635308)
            ]
            
            self.cursor.executemany('''
                INSERT INTO usuarios (email, senha, nome, tipo_usuario, latitude, longitude)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', usuarios)
            
            print("✓ Usuários inseridos com sucesso!")
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao inserir usuários: {erro}")
            return False

    def inserir_feirantes(self):
        """Insere feirantes de teste."""
        try:
            feirantes = [
                (2, 'Hortifruti da Maria', 'https://wa.me/5511999999999'),
                (3, 'Legumes da Ana', 'https://wa.me/5511888888888')
            ]
            
            self.cursor.executemany('''
                INSERT INTO feirantes (usuario_id, nome_estabelecimento, link_wpp)
                VALUES (?, ?, ?)
            ''', feirantes)
            
            print("✓ Feirantes inseridos com sucesso!")
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao inserir feirantes: {erro}")
            return False

    def inserir_produtos(self):
        """Insere produtos de teste."""
        try:
            produtos = [
                (1, 'Maçã Verde', 'Maçã verde fresca da temporada', 5.50, -23.551520, -46.634308),
                (1, 'Banana Prata', 'Banana prata orgânica', 3.20, -23.551520, -46.634308),
                (2, 'Alface Crespa', 'Alface crespa hidropônica', 2.80, -23.552520, -46.635308),
                (2, 'Tomate Italiano', 'Tomate italiano saboroso', 6.90, -23.552520, -46.635308)
            ]
            
            self.cursor.executemany('''
                INSERT INTO produtos (feirante_id, nome, descricao, preco, latitude, longitude)
                VALUES (?, ?, ?, ?, ?, ?)
            ''', produtos)
            
            print("✓ Produtos inseridos com sucesso!")
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao inserir produtos: {erro}")
            return False

    def inserir_avaliacoes(self):
        """Insere avaliações de teste."""
        try:
            # Avaliações para feirantes
            avaliacoes_feirantes = [
                (1, 1, 4.5, 'Ótimo atendimento e produtos frescos!'),
                (2, 1, 4.0, 'Preços justos e boa qualidade')
            ]
            
            self.cursor.executemany('''
                INSERT INTO avaliacoes_feirantes (feirante_id, usuario_id, nota, comentario)
                VALUES (?, ?, ?, ?)
            ''', avaliacoes_feirantes)
            
            # Avaliações para produtos
            avaliacoes_produtos = [
                (1, 1, 5.0, 'Maçãs muito saborosas!'),
                (2, 1, 4.5, 'Bananas no ponto certo'),
                (3, 1, 4.0, 'Alface bem fresquinha')
            ]
            
            self.cursor.executemany('''
                INSERT INTO avaliacoes_produtos (produto_id, usuario_id, nota, comentario)
                VALUES (?, ?, ?, ?)
            ''', avaliacoes_produtos)
            
            print("✓ Avaliações inseridas com sucesso!")
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao inserir avaliações: {erro}")
            return False

    def inserir_historico_buscas(self):
        """Insere histórico de buscas de teste."""
        try:
            historico = [
                (1, 'maçã', None),
                (1, 'banana', None),
                (1, None, 'Hortifruti da Maria')
            ]
            
            self.cursor.executemany('''
                INSERT INTO historico_buscas (usuario_id, produto_buscado, feirante_buscado)
                VALUES (?, ?, ?)
            ''', historico)
            
            print("✓ Histórico de buscas inserido com sucesso!")
            return True
        except sqlite3.Error as erro:
            print(f"Erro ao inserir histórico de buscas: {erro}")
            return False

    def popular_banco_completo(self):
        """Popula todo o banco com dados de teste."""
        if not self.conectar():
            return False

        try:
            print("Iniciando inserção de dados de teste...")
            
            metodos_insercao = [
                self.inserir_usuarios,
                self.inserir_feirantes,
                self.inserir_produtos,
                self.inserir_avaliacoes,
                self.inserir_historico_buscas
            ]

            for metodo in metodos_insercao:
                if not metodo():
                    return False

            self.conexao.commit()
            print("\n🎉 Banco populado com dados de teste com sucesso!")
            return True

        except sqlite3.Error as erro:
            print(f"Erro ao popular banco: {erro}")
            return False
        finally:
            self.fechar_conexao()

    def fechar_conexao(self):
        """Fecha a conexão com o banco de dados."""
        if self.conexao:
            self.conexao.close()


def main():
    """Função principal para popular o banco com dados de teste."""
    inseridor = InseridorDadosTeste()
    
    if inseridor.popular_banco_completo():
        print("Dados de teste inseridos com sucesso!")
    else:
        print("Erro ao inserir dados de teste.")


if __name__ == "__main__":
    main()