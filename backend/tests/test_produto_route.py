from flask_jwt_extended import create_access_token
import pytest
import json
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.insert(0, parent_dir)

from run import create_app
from app.models import produtos_rep, feirantes_rep, usuario_rep

DADOS_USUARIO = {
    "email": "produtor.teste@gmail.com",
    "nome": "Produtor Teste",
    "senha": "$ProdutorSenh4",
    "tipo_usuario": "Feirante"
}

DADOS_FEIRANTE = {
    "nome_estabelecimento": "Barraca do Produtor",
    "link_wpp": "https://wa.me/556177777777"
}

DADOS_PRODUTO_1 = {
    "nome": "Tomate Cereja",
    "descricao": "Bandeja 250g",
    "preco": 8.50,
    "latitude": -15.7942,
    "longitude": -47.8822
}

DADOS_PRODUTO_2 = {
    "nome": "Alface Americana",
    "descricao": "Unidade hidropônica",
    "preco": 4.00,
    "latitude": -15.7940,
    "longitude": -47.8820
}

@pytest.fixture
def client():
    app = create_app()
    with app.test_client() as client:
        yield client

@pytest.fixture
def setup_para_produto(client):
    email_usuario = DADOS_USUARIO["email"]
    usuario_id = None
    feirante_id = None
    token_de_acesso = None

    try:
        try:
            usuario_rep.adicionar_usuario(**DADOS_USUARIO)
        except ValueError as e:
            if "UNIQUE constraint" not in str(e) and "já existe" not in str(e):
                print(f"AVISO SETUP: Erro ao criar usuário: {e}")

        with client.application.app_context():
            token_de_acesso = create_access_token(identity = email_usuario)

        usuario = usuario_rep.listar_usuarios(email = email_usuario)
        if usuario:
            usuario_id = usuario[0]['id']

        try:
            feirante_id = feirantes_rep.criar_feirante(
                usuario_id=usuario_id,
                **DADOS_FEIRANTE
            )
        except Exception:
            lista = feirantes_rep.listar_feirantes()
            for f in lista:
                if f['usuario_id'] == usuario_id:
                    feirante_id = f['id']
                    break

        yield {
            "token": token_de_acesso,
            "feirante_id": feirante_id,
            "usuario_id": usuario_id
        }

    finally:
        try:
            if feirante_id:
                feirantes_rep.deletar_feirante(feirante_id)
            if email_usuario:
                usuario_rep.deletar_usuario(email_usuario)
        except Exception as e:
            print(f"AVISO [LIMPEZA SETUP]: {e}")


def test_criar_produto(client, setup_para_produto):
    id_produto_criado = None
    token = setup_para_produto["token"]
    feirante_id = setup_para_produto["feirante_id"]

    try:
        headers = {'Authorization': f'Bearer {token}'}

        payload = DADOS_PRODUTO_1.copy()
        payload['feirante_id'] = feirante_id

        response = client.post('/api/produtos/', json=payload, headers=headers)

        assert response.status_code == 201, (
            f"Esperado 201, obteve {response.status_code}. Body: {response.get_data(as_text = True)}"
        )

        data = response.get_json()
        id_produto_criado = data.get('id')

        assert id_produto_criado is not None
        assert data.get('nome') == DADOS_PRODUTO_1['nome']
        assert float(data.get('preco')) == DADOS_PRODUTO_1['preco']
        assert data.get('feirante_id') == feirante_id

    finally:
        if id_produto_criado:
            try:
                produtos_rep.deletar_produto(id_produto_criado)
            except Exception as e:
                print(f"AVISO: Falha ao limpar produto {id_produto_criado}: {e}")


def test_listar_produtos(client, setup_para_produto):
    ids_criados = []
    feirante_id = setup_para_produto["feirante_id"]

    try:
        id1 = produtos_rep.adicionar_produto(feirante_id=feirante_id, **DADOS_PRODUTO_1)
        ids_criados.append(id1)

        id2 = produtos_rep.adicionar_produto(feirante_id=feirante_id, **DADOS_PRODUTO_2)
        ids_criados.append(id2)

        response = client.get('/api/produtos/')
        assert response.status_code == 200

        lista = response.get_json()
        assert isinstance(lista, list)
        assert len(lista) >= 2

        ids_na_lista = [p['id'] for p in lista]
        assert id1 in ids_na_lista
        assert id2 in ids_na_lista

        response_filtro = client.get(f'/api/produtos/?feirante_id={feirante_id}')
        assert response_filtro.status_code == 200
        lista_filtro = response_filtro.get_json()
        assert len(lista_filtro) >= 2
        assert lista_filtro[0]['feirante_id'] == feirante_id

    finally:
        for p_id in ids_criados:
            try:
                produtos_rep.deletar_produto(p_id)
            except Exception:
                pass


def test_buscar_produto_por_id(client, setup_para_produto):
    id_produto_criado = None
    feirante_id = setup_para_produto["feirante_id"]

    try:
        id_produto_criado = produtos_rep.adicionar_produto(
            feirante_id=feirante_id,
            **DADOS_PRODUTO_1
        )

        response = client.get(f'/api/produtos/{id_produto_criado}')
        assert response.status_code == 200

        data = response.get_json()
        assert data['id'] == id_produto_criado
        assert data['nome'] == DADOS_PRODUTO_1['nome']

        response_404 = client.get('/api/produtos/999999')
        assert response_404.status_code == 404

    finally:
        if id_produto_criado:
            try:
                produtos_rep.deletar_produto(id_produto_criado)
            except Exception:
                pass


def test_deletar_produto(client, setup_para_produto):
    id_produto = None
    token = setup_para_produto["token"]
    feirante_id = setup_para_produto["feirante_id"]
    headers = {'Authorization': f'Bearer {token}'}

    try:
        id_produto = produtos_rep.adicionar_produto(
            feirante_id=feirante_id,
            **DADOS_PRODUTO_1
        )
        assert id_produto is not None

        response = client.delete(f'/api/produtos/{id_produto}', headers=headers)
        assert response.status_code == 200
        assert "deletado com sucesso" in response.get_json().get("mensagem", "")

        busca = produtos_rep.buscar_produto_por_id(id_produto)
        assert busca is None, "Produto ainda existe no banco após delete"

        response_404 = client.delete(f'/api/produtos/{id_produto}', headers=headers)
        assert response_404.status_code == 404

        id_produto = None

    finally:
        if id_produto:
            try:
                produtos_rep.deletar_produto(id_produto)
            except Exception:
                pass