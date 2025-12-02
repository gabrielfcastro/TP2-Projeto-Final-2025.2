import pytest
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, root_dir)

from app.models.connection import engine
from app.models import usuario_rep

def test_criar_deletar_usuario():
    email = "pauloalves@gmail.com"

    try:
        usuario_id = usuario_rep.adicionar_usuario(
            email=email,
            senha="!PauloAlves123",
            nome="Paulo Alves",
            tipo_usuario = "Cliente",
        )

        assert usuario_id is not None
        
        usuario_db = usuario_rep.listar_usuarios(id = usuario_id)[0]

        email = usuario_db['email']
        nome = usuario_db['nome']
        tipo_usuario = usuario_db['tipo_usuario']

        assert email == "pauloalves@gmail.com"
        assert nome == "Paulo Alves"
        assert tipo_usuario == "Cliente"

        assert usuario_rep.verificar_credenciais(
                email,
                senha_enviada="!PauloAlves123"
            ) is not None

    finally:
        try:
            usuario_rep.deletar_usuario(email)
            print(f"Usuário de email {email} removido com sucesso.")
        except Exception as e:
            print(f"Falha ao limpar usuário de email {email}: {e}")