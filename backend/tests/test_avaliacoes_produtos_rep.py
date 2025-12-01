"""
Testes para o módulo de repositório de avaliações de produtos.

Contém testes unitários para validar as operações de banco de dados
de avaliações de produtos.
"""

#Inicie o WSL na pasta backend antes de rodar:
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


@pytest.fixture()
def setup_produto():
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
