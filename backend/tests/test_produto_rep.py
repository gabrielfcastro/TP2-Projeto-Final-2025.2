from sqlalchemy import text
import pytest
import sys
import os

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, root_dir)

from app.models.connection import engine
from app.models import produtos_rep

ID_FEIRANTE_TESTE = 999
NOME_FEIRANTE_TESTE = "Feirante Teste"

@pytest.fixture()
def setup_feirante():
    with engine.begin() as conn:
        try:
            conn.execute(text(f"INSERT INTO feirantes (id, nome) VALUES ({ID_FEIRANTE_TESTE}, '{NOME_FEIRANTE_TESTE}')"))
        except Exception:
            pass

    yield ID_FEIRANTE_TESTE

    with engine.begin() as conn:
        conn.execute(text(f"DELETE FROM produtos WHERE feirante_id = {ID_FEIRANTE_TESTE}"))
        conn.execute(text(f"DELETE FROM feirantes WHERE id = {ID_FEIRANTE_TESTE}"))

def test_adicionar_produto_sucesso(setup_feirante):

    id_prod = produtos_rep.adicionar_produto(
        feirante_id = setup_feirante,
        nome = "Cenoura Organica",
        preco = 4.50,
        descricao = "Cenoura fresca",
        latitude = -15.5,
        longitude = -47.5
    )
    assert id_prod is not None

    produto_db = produtos_rep.buscar_produto_por_id(id_prod)
    assert produto_db['nome'] == "Cenoura Organica"
    assert produto_db['preco'] == 4.50

    produtos_rep.deletar_produto(id_prod)

def test_validacao_nome(setup_feirante):
    with pytest.raises(ValueError) as error_info:
        produtos_rep.adicionar_produto(setup_feirante, "A", 10.0)
    assert "Nome do produto inválido" in str(error_info.value)

def test_validacao_preco(setup_feirante):
    with pytest.raises(ValueError) as error_info:
        produtos_rep.adicionar_produto(setup_feirante, "Batata", -5.00)
    assert "O valor deve ser maior que zero" in str(error_info.value)

    with pytest.raises(ValueError) as error_info:
        produtos_rep.adicionar_produto(setup_feirante, "Batata", 5.555)
    assert "duas casas decimais" in str(error_info.value)

def test_listar_e_deletar(setup_feirante):
    id1 = produtos_rep.adicionar_produto(setup_feirante, "Produto A", 10.00)
    id2 = produtos_rep.adicionar_produto(setup_feirante, "Produto B", 20.50)

    lista = produtos_rep.listar_produtos(feirante_id=setup_feirante)
    nomes = [p['nome'] for p in lista]

    assert "Produto A" in nomes
    assert "Produto B" in nomes

    produtos_rep.deletar_produto(id1)
    assert produtos_rep.buscar_produto_por_id(id1) is None

    produtos_rep.deletar_produto(id2)