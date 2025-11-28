import pytest
import sys
import os

from app.models.connection import engine
from app.models import usuario_rep

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir))
sys.path.insert(0, root_dir)

def test_criar_deletar_usuario():
    
    usuario_id = usuario_rep.adicionar_usuario(
        email="joaoalves@gmail.com",
        senha="!JoaoAlves123",
        nome="Joao Alves",
        tipo_usuario = "Cliente",
    )

    assert usuario_id is not None
    usuario_db = usuario_rep.listar_usuarios(usuario_id)
    assert usuario_db['email'] == "joaoalves@gmail.com", "Email não corresponde"
    assert usuario_db['senha'] == "!JoaoAlves123", "Senha não corresponde"
    assert usuario_db['nome'] == "João Alves", "Nome não corresponde"
    assert usuario_db['tipo_usuario'] == "Cliente" , "Tipo de usuário não corresponde"

    usuario_rep.deletar_usuario(usuario_id)
