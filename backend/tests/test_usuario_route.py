import sys
import os
import pytest
import json

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from run import create_app
from app.models import usuario_rep

@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        yield client

DADOS_USUARIO_DONO = {
    "email": "matheus.mendes@gmail.com",
    "nome": "Matheus Mendes",
    "senha": "$MatheusM3ndes",
    "tipo_usuario": "Usuario"}

def test_criar_usuario_e_limpar(client):
    
    usuario_id = None
    
    try:
        response = client.post('/api/usuarios/', json=DADOS_USUARIO_DONO)

        assert response.status_code == 201
        
        dados= response.get_json()
        assert dados is not None

        email = dados.get('email')
        token = dados.get('access_token')
        usuario = usuario_rep.listar_usuarios(email)[0]

        assert usuario is not None
        assert token is not None

        assert usuario.get('nome') == DADOS_USUARIO_DONO['nome']
        assert usuario.get('email') == DADOS_USUARIO_DONO['email']
        assert usuario.get('tipo_usuario') == DADOS_USUARIO_DONO['tipo_usuario']

        assert usuario_rep.verificar_credenciais(
            email=email, 
            senha_enviada=DADOS_USUARIO_DONO['senha']
        ) is not None
        
    finally:      
        try:
            usuario_rep.deletar_usuario(email)
            print(f"Usuário de Id {usuario_id} removido com sucesso.")
        except Exception as e:
            print(f"Falha ao limpar usuário {e}")