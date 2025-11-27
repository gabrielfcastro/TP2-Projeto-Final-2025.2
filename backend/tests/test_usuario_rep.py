import pytest
import sys
import os

from app.models.connection import engine
from app.models import usuario_rep

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir))
sys.path.insert(0, root_dir)

def test_criar_deletar_usuario():
    try:
        usuario_id = usuario_rep.adicionar_usuario(
            email="pauloalves@gmail.com",
            senha="!PauloAlves123",
            nome="Paulo Alves",
            tipo_usuario = "Cliente",
        )

        assert usuario_id is not None
        usuario_db = usuario_rep.listar_usuarios(usuario_id)[0]
        assert usuario_db['email'] == "pauloalves@gmail.com"
        assert usuario_db['nome'] == "Paulo Alves"
        assert usuario_db['tipo_usuario'] == "Cliente"
        assert usuario_rep.verificar_credenciais(
                usuario_id, 
                senha_enviada="!PauloAlves123"
            ) is not None
            
    finally:      
        try:
            usuario_rep.deletar_usuario(usuario_id)
            print(f"Usuário de ID {usuario_id} removido com sucesso.")
        except Exception as e:
            print(f"Falha ao limpar usuário de ID {usuario_id}: {e}")
