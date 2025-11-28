import sys
import os
import pytest
import json

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from run import app
from app.models import usuario_rep

@pytest.fixture
def client():
    with app.test_client() as client:
        yield client

DADOS_USUARIO_DONO = {
    "id": 10,
    "email": "matheus.mendes@gmail.com",
    "nome": "Matheus Mendes",
    "senha": "$MatheusM3ndes"}

def test_criar_usuario_e_limpar(client):
    
    try:
        response = client.post('/api/usuarios/', json=DADOS_USUARIO_DONO)

        assert response.status_code == 201
        
        dados= response.get_json()
        assert dados is not None

        usuario_id= dados.get('id')
        token = dados.get('access_token')
        usuario = usuario_rep.listar_usuarios(usuario_id)[0]

        assert usuario is not None
        assert token is not None
        assert usuario.get('id') == DADOS_USUARIO_DONO['id']
        assert usuario.get('nome') == DADOS_USUARIO_DONO['nome']
        assert usuario.get('email') == DADOS_USUARIO_DONO['email']

        assert usuario_rep.verificar_credenciais(
            id=DADOS_USUARIO_DONO['id'], 
            senha_enviada=DADOS_USUARIO_DONO['senha']
        ) is not None
        
    finally:      
        try:
            usuario_rep.deletar_usuario(usuario_id)
            print(f"Usuário de Id {usuario_id} removido com sucesso.")
        except Exception as e:
            print(f"Falha ao limpar usuário {e}")