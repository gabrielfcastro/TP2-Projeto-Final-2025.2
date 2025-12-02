from flask_jwt_extended import create_access_token
import pytest
import json
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from run import create_app
from app.models import feirantes_rep, usuario_rep

DADOS_USUARIO = {
    "email": "matheus.mendes@gmail.com",
    "nome": "Matheus Mendes",
    "senha": "$MatheusM3ndes",
    "tipo_usuario": "Usuario"}

DADOS_FEIRANTE_1 = {
    "nome_estabelecimento": "Barraca do Pastel",
    "link_wpp": "https://wa.me/556199999999"
}

DADOS_FEIRANTE_2 = {
    "nome_estabelecimento": "Horta Fresca",
    "link_wpp": "https://wa.me/556188888888"
}

@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        yield client

@pytest.fixture
def setup_para_feirante(client):
    email_usuario = DADOS_USUARIO["email"]
    usuario_id = None
    token_de_acesso = None

    try:
        try:
            usuario_rep.adicionar_usuario(**DADOS_USUARIO)

        except ValueError as e:
            if "UNIQUE constraint" not in str(e) and "já existe" not in str(e):
                print(f"AVISO SETUP: Erro ao criar usuário (pode já existir): {e}")

        with client.application.app_context():
            token_de_acesso = create_access_token(identity = email_usuario)

        usuario = usuario_rep.listar_usuarios(email = email_usuario)

        if usuario:
            usuario_id = usuario[0]['id']

        yield {
            "email": email_usuario,
            "usuario_id": usuario_id,
            "token": token_de_acesso
        }

    finally:
        try:
            if email_usuario:
                usuario_rep.deletar_usuario(email_usuario)
        except Exception as e:
            print(f"AVISO [LIMPEZA]: Falha ao deletar usuário: {e}")

def test_criar_feirante(client, setup_para_feirante):
    id_feirante_criado = None
    token = setup_para_feirante["token"]

    try:
        headers = {'Authorization': f'Bearer {token}'}
        response = client.post('/api/feirantes/', json = DADOS_FEIRANTE_1, headers = headers)

        assert response.status_code == 201, (
            f"Esperado 201, obteve {response.status_code}. Body: {response.get_data(as_text=True)}"
        )
        data = response.get_json()
        id_feirante_criado = data.get('id')

        assert id_feirante_criado is not None
        assert data.get('nome_estabelecimento') == DADOS_FEIRANTE_1['nome_estabelecimento']
        assert data.get('link_wpp') == DADOS_FEIRANTE_1['link_wpp']

    finally:
        if id_feirante_criado:
            try:
                feirantes_rep.deletar_feirante(id_feirante_criado)
            except Exception as e:
                print(f"AVISO: Falha ao limpar feirante {id_feirante_criado}: {e}")

def test_buscar_feirante_por_id(client, setup_para_feirante):
    id_feirante_criado = None

    try:
        id_feirante_criado = feirantes_rep.criar_feirante(
            usuario_id=setup_para_feirante["usuario_id"],
            **DADOS_FEIRANTE_1
        )

        response = client.get(f'/api/feirantes/{id_feirante_criado}')
        assert response.status_code == 200
        data = response.get_json()
        assert data['id'] == id_feirante_criado
        assert data['nome_estabelecimento'] == DADOS_FEIRANTE_1['nome_estabelecimento']

    finally:
        if id_feirante_criado:
            try:
                feirantes_rep.deletar_feirante(id_feirante_criado)
            except Exception:
                pass

def test_listar_todos_feirantes(client, setup_para_feirante):
    ids_criados = []

    try:
        id1 = feirantes_rep.criar_feirante(setup_para_feirante["usuario_id"], **DADOS_FEIRANTE_1)
        ids_criados.append(id1)

        dados_2 = DADOS_FEIRANTE_2.copy()
        id2 = feirantes_rep.criar_feirante(setup_para_feirante["usuario_id"], **dados_2)
        ids_criados.append(id2)

        response = client.get('/api/feirantes/') # Rota GET sem auth
        assert response.status_code == 200

        lista = response.get_json()
        assert isinstance(lista, list)
        assert len(lista) >= 2

        ids_na_lista = [f['id'] for f in lista]
        assert id1 in ids_na_lista
        assert id2 in ids_na_lista

    finally:
        for f_id in ids_criados:
            try:
                feirantes_rep.deletar_feirante(f_id)
            except Exception:
                pass

def test_deletar_feirante(client, setup_para_feirante):
    id_feirante = None
    token = setup_para_feirante["token"]
    headers = {'Authorization': f'Bearer {token}'}

    try:
        id_feirante = feirantes_rep.criar_feirante(
            usuario_id=setup_para_feirante["usuario_id"],
            **DADOS_FEIRANTE_1
        )
        assert id_feirante is not None

        response = client.delete(f'/api/feirantes/{id_feirante}', headers=headers)
        assert response.status_code == 200
        assert "deletado com sucesso" in response.get_json().get("mensagem", "")

        busca = feirantes_rep.buscar_feirante_por_id(id_feirante)
        assert busca is None, "Feirante ainda existe no banco após delete"

        response_404 = client.delete(f'/api/feirantes/{id_feirante}', headers=headers)
        assert response_404.status_code == 404

        id_feirante = None

    finally:
        if id_feirante:
            try:
                feirantes_rep.deletar_feirante(id_feirante)
            except Exception:
                pass