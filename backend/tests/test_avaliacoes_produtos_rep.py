"""
Testes para o módulo de repositório de avaliações de produtos.

Contém testes unitários para validar as operações de banco de dados
de avaliações de produtos.
"""

#Inicie o WSL na pasta backend antes de rodar:
#source .env/bin/activate
#make pylint PYLINTFILE=tests/test_avaliacoes_produtos_rep.py
#make test TESTFILE=tests/test_avaliacoes_produtos_rep.py

import sys
import os
from sqlalchemy import text
import pytest

from app.models.connection import engine
from app.models import avaliacoes_produtos_rep

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, root_dir)


ID_PRODUTO_TESTE = 9999
ID_FEIRANTE_TESTE = 8888
NOME_PRODUTO_TESTE = "Produto Teste"


#O comentário abaixo desabilita o aviso do pylint sobre variavel com mesmo nome
@pytest.fixture()
def setup_produto():  # pylint: disable=redefined-outer-name
    """Fixture que configura dados de teste para avaliações de produtos.
    Cria um feirante e um produto antes do teste e os remove após o teste.
    """
    with engine.begin() as conn:
        try:
            conn.execute(text(
                f"INSERT INTO feirantes (id, nome) VALUES ({ID_FEIRANTE_TESTE}, 'Feirante Teste')"
                ))
        except Exception:
            pass
        try:
            conn.execute(text(
                f"INSERT INTO produtos (id, feirante_id, nome, preco) "
                f"VALUES ({ID_PRODUTO_TESTE}, {ID_FEIRANTE_TESTE}, '{NOME_PRODUTO_TESTE}', 10.00)"
                ))
        except Exception:
            pass

    yield ID_PRODUTO_TESTE

    with engine.begin() as conn:
        conn.execute(text(f"DELETE FROM avaliacoes_produto WHERE produto_id = {ID_PRODUTO_TESTE}"))
        conn.execute(text(f"DELETE FROM produtos WHERE id = {ID_PRODUTO_TESTE}"))
        conn.execute(text(f"DELETE FROM feirantes WHERE id = {ID_FEIRANTE_TESTE}"))


def test_adicionar_avaliacao_produto_sucesso(setup_produto):  # pylint: disable=redefined-outer-name
    """Teste para adicionar uma avaliação de produto corretamente."""
    produto_id = setup_produto
    nota = 4
    comentario = "Ótimo produto!"

    nova_avaliacao = avaliacoes_produtos_rep.adicionar_avaliacao_produto(
        produto_id, nota, comentario
    )

    assert nova_avaliacao is not None
    assert nova_avaliacao.produto_id == produto_id
    assert nova_avaliacao.nota == nota
    assert nova_avaliacao.comentario == comentario
