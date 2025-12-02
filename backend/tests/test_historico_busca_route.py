from flask_jwt_extended import create_access_token
import pytest
import json
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from run import create_app
from app.models import historico_busca_rep, usuario_rep

DADOS_USUARIO_TESTE = {
    "email": "usuario.historico@teste.com",
    "nome": "Usuário Histórico",
    "senha": "$SenhaTeste123",
    "tipo_usuario": "Usuario"
}

DADOS_BUSCA_PRODUTO = {
    "produto_buscado": "Tomate Cereja",
    "feirante_buscado": ""
}

DADOS_BUSCA_FEIRANTE = {
    "produto_buscado": "",
    "feirante_buscado": "Barraca do João"
}

DADOS_BUSCA_COMPLETA = {
    "produto_buscado": "Alface",
    "feirante_buscado": "Feira do Produtor"
}

@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        yield client

@pytest.fixture
def setup_usuario_token(client):
    email_usuario = DADOS_USUARIO_TESTE["email"]
    usuario_id = None
    token_de_acesso = None
    
    try:
        try:
            usuario_id = usuario_rep.adicionar_usuario(**DADOS_USUARIO_TESTE)
        except ValueError as e:
            if "UNIQUE constraint" not in str(e) and "já existe" not in str(e):
                print(f"AVISO SETUP: Erro ao criar usuário: {e}")
            usuario = usuario_rep.listar_usuarios(email=email_usuario)
            if usuario:
                usuario_id = usuario[0]['id']
        
        with client.application.app_context():
            token_de_acesso = create_access_token(identity=usuario_id)
        
        yield {
            "token": token_de_acesso,
            "usuario_id": usuario_id,
            "email": email_usuario
        }
    
    finally:
        try:
            if usuario_id:
                historico_busca_rep.deletar_historico_por_usuario(usuario_id)
            if email_usuario:
                usuario_rep.deletar_usuario(email_usuario)
        except Exception as e:
            print(f"AVISO [LIMPEZA SETUP]: {e}")

def test_criar_historico_busca(client, setup_usuario_token):
    token = setup_usuario_token["token"]
    usuario_id = setup_usuario_token["usuario_id"]
    historico_id = None
    
    try:
        headers = {'Authorization': f'Bearer {token}'}
        
        response = client.post('/api/historico_busca/', 
                             json=DADOS_BUSCA_PRODUTO, 
                             headers=headers)
        
        assert response.status_code == 201, (
            f"Esperado 201, obteve {response.status_code}. Body: {response.get_data(as_text=True)}"
        )
        
        data = response.get_json()
        historico_id = data.get('historico_id')
        
        assert historico_id is not None
        assert data.get('mensagem') == 'Busca salva no histórico'
        
        historico = historico_busca_rep.buscar_historico_por_id(historico_id)
        assert historico is not None
        assert historico['produto_buscado'] == DADOS_BUSCA_PRODUTO['produto_buscado']
        assert historico['usuario_id'] == usuario_id
    
    finally:
        if historico_id:
            try:
                historico_busca_rep.deletar_historico_busca(historico_id)
            except Exception as e:
                print(f"AVISO: Falha ao limpar histórico {historico_id}: {e}")

def test_criar_historico_apenas_feirante(client, setup_usuario_token):
    token = setup_usuario_token["token"]
    usuario_id = setup_usuario_token["usuario_id"]
    historico_id = None
    
    try:
        headers = {'Authorization': f'Bearer {token}'}
        
        response = client.post('/api/historico_busca/', 
                             json=DADOS_BUSCA_FEIRANTE, 
                             headers=headers)
        
        assert response.status_code == 201
        
        data = response.get_json()
        historico_id = data.get('historico_id')
        
        historico = historico_busca_rep.buscar_historico_por_id(historico_id)
        assert historico['feirante_buscado'] == DADOS_BUSCA_FEIRANTE['feirante_buscado']
        assert historico['produto_buscado'] == ""
    
    finally:
        if historico_id:
            try:
                historico_busca_rep.deletar_historico_busca(historico_id)
            except Exception:
                pass

def test_criar_historico_busca_sem_dados(client, setup_usuario_token):
    token = setup_usuario_token["token"]
    headers = {'Authorization': f'Bearer {token}'}
    
    response = client.post('/api/historico_busca/', 
                         json={"produto_buscado": "", "feirante_buscado": ""}, 
                         headers=headers)
    
    assert response.status_code == 400
    data = response.get_json()
    assert "produto ou feirante" in data.get('erro', '').lower() 

def test_listar_historico_busca(client, setup_usuario_token):
    token = setup_usuario_token["token"]
    usuario_id = setup_usuario_token["usuario_id"]
    ids_criados = []
    
    try:
        headers = {'Authorization': f'Bearer {token}'}
        
        for i in range(3):
            historico_id = historico_busca_rep.adicionar_historico_busca(
                usuario_id=usuario_id,
                produto_buscado=f"Produto Teste {i+1}",
                feirante_buscado=""
            )
            ids_criados.append(historico_id)
        
        response = client.get('/api/historico_busca/', headers=headers)
        
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['usuario_id'] == usuario_id
        assert data['total_buscas'] >= 3
        assert isinstance(data['historicos'], list)
        
        produtos_listados = [h['produto_buscado'] for h in data['historicos']]
        assert "Produto Teste 1" in produtos_listados
        assert "Produto Teste 2" in produtos_listados
    
    finally:
        for h_id in ids_criados:
            try:
                historico_busca_rep.deletar_historico_busca(h_id)
            except Exception:
                pass

def test_deletar_historico_inexistente(client, setup_usuario_token):
    token = setup_usuario_token["token"]
    headers = {'Authorization': f'Bearer {token}'}
    
    response = client.delete('/api/historico_busca/999999', headers=headers)
    
    assert response.status_code == 404

def test_limpar_todo_historico(client, setup_usuario_token):
    token = setup_usuario_token["token"]
    usuario_id = setup_usuario_token["usuario_id"]
    
    try:
        headers = {'Authorization': f'Bearer {token}'}
        
        for i in range(3):
            historico_busca_rep.adicionar_historico_busca(
                usuario_id=usuario_id,
                produto_buscado=f"Produto {i+1}",
                feirante_buscado=""
            )
        
        response = client.delete('/api/historico_busca/', headers=headers)
        
        assert response.status_code == 200
        
        data = response.get_json()
        assert data['registros_removidos'] >= 3
        
        historicos = historico_busca_rep.listar_historico_busca(usuario_id=usuario_id)
        assert len(historicos) == 0
    
    finally:
        historico_busca_rep.deletar_historico_por_usuario(usuario_id)

def test_listar_sem_token(client):
    response = client.get('/api/historico_busca/')
    
    assert response.status_code == 401 