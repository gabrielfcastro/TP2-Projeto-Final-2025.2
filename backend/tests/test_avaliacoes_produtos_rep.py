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
from decimal import Decimal
from sqlalchemy import text
import pytest
from datetime import datetime

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
        conn.execute(text(f"DELETE FROM avaliacoes_produtos WHERE produto_id = {ID_PRODUTO_TESTE}"))
        conn.execute(text(f"DELETE FROM produtos WHERE id = {ID_PRODUTO_TESTE}"))
        conn.execute(text(f"DELETE FROM feirantes WHERE id = {ID_FEIRANTE_TESTE}"))


def test_adicionar_avaliacao_produto_sucesso(setup_produto):  # pylint: disable=redefined-outer-name
    """Teste para adicionar uma avaliação de produto corretamente."""
    produto_id = setup_produto
    nota = Decimal('4.5')
    comentario = "Ótimo produto!"
    data_avaliacao = datetime.now()

    nova_avaliacao = avaliacoes_produtos_rep.adicionar_avaliacao_produto(
        produto_id, nota, comentario, data_avaliacao
    )

    print(nova_avaliacao.nota)
    assert nova_avaliacao is not None
    assert nova_avaliacao.produto_id == produto_id
    assert nova_avaliacao.nota == nota
    assert nova_avaliacao.nota is not None
    assert nova_avaliacao.comentario == comentario
    assert nova_avaliacao.data_avaliacao == data_avaliacao

def test_adicionar_avaliacao_produto_nota_invalida(setup_produto):  # pylint: disable=redefined-outer-name
    """Teste para adicionar uma avaliação de produto com nota inválida."""
    produto_id = setup_produto
    comentario = "Bom produto."
    data_avaliacao = datetime.now()

    with pytest.raises(ValueError) as error_info:
        avaliacoes_produtos_rep.adicionar_avaliacao_produto(
            produto_id, None, comentario, data_avaliacao
        )
    assert "A nota não pode ser nula." in str(error_info.value)

    with pytest.raises(ValueError) as error_info:
        avaliacoes_produtos_rep.adicionar_avaliacao_produto(
            produto_id, "abc", comentario, data_avaliacao
        )
    assert "O valor fornecido não é um número decimal válido." in str(error_info.value)

    with pytest.raises(ValueError) as error_info:
        avaliacoes_produtos_rep.adicionar_avaliacao_produto(
            produto_id, Decimal('3.14'), comentario, data_avaliacao
        )
    assert "A nota não pode ter mais de 1 casa decimal." in str(error_info.value)

    with pytest.raises(ValueError) as error_info:
        avaliacoes_produtos_rep.adicionar_avaliacao_produto(
            produto_id, Decimal('0.0'), comentario, data_avaliacao
        )
    assert "A nota não pode ser menor que 1.0." in str(error_info.value)

    with pytest.raises(ValueError) as error_info:
        avaliacoes_produtos_rep.adicionar_avaliacao_produto(
            produto_id, Decimal('6.0'), comentario, data_avaliacao
        )
    assert "A nota não pode ser maior que 5.0." in str(error_info.value)

def test_adicionar_avaliacao_produto_comentario_longo(setup_produto):  # pylint: disable=redefined-outer-name
    """Teste para adicionar uma avaliação de produto com comentário muito longo."""
    produto_id = setup_produto
    nota = Decimal('4.0')
    comentario = "A" * (avaliacoes_produtos_rep.TAMANHO_MAX_COMENTARIO + 1)
    data_avaliacao = datetime.now()

    with pytest.raises(ValueError) as error_info:
        avaliacoes_produtos_rep.adicionar_avaliacao_produto(
            produto_id, nota, comentario, data_avaliacao
        )
    assert f"O comentário não pode exceder {avaliacoes_produtos_rep.TAMANHO_MAX_COMENTARIO} caracteres." in str(error_info.value)

def test_deletar_avaliacao_produto(setup_produto):  # pylint: disable=redefined-outer-name
    """Teste para deletar uma avaliação de produto."""
    produto_id = setup_produto
    nota = Decimal('5.0')
    comentario = "Excelente!"
    data_avaliacao = datetime.now()

    nova_avaliacao = avaliacoes_produtos_rep.adicionar_avaliacao_produto(
        produto_id, nota, comentario, data_avaliacao
    )

    assert nova_avaliacao is not None

    avaliacoes_produtos_rep.deletar_avaliacao_produto(nova_avaliacao.id)

    with engine.connect() as conn:
        stmt = text(f"SELECT * FROM avaliacoes_produtos WHERE id = {nova_avaliacao.id}")
        result = conn.execute(stmt).first()
        assert result is None