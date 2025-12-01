"""
=====================
HISTÓRIAS DE USUÁRIO
=====================

HU01 - Como feirante, quero cadastrar meu estabelecimento para que clientes possam me encontrar.

HU02 - Como usuário, quero listar todos os feirantes cadastrados para explorar os produtos da feira.

HU03 - Como usuário, quero visualizar dados de um feirante específico para saber seus detalhes.

HU04 - Como feirante, quero atualizar meu nome ou link para manter meus dados corretos.

HU05 - Como feirante, quero excluir meu cadastro caso eu não participe mais da feira.
"""

import pytest
from app.models import feirantes_rep


# --------------------
# HU01 — Criar feirante
# --------------------
def test_hu01_criar_feirante():
    novo_id = feirantes_rep.criar_feirante(
        usuario_id=1,
        nome_estabelecimento="Barraca do Zé",
        link_wpp="https://wa.me/123"
    )

    assert novo_id is not None

    feirante = feirantes_rep.buscar_feirante_por_id(novo_id)
    assert feirante["nome_estabelecimento"] == "Barraca do Zé"
    assert feirante["link_wpp"] == "https://wa.me/123"

# --------------------
# HU02 — Listar feirantes
# --------------------
def test_hu02_listar_feirantes():
    lista = feirantes_rep.listar_feirantes()

    assert isinstance(lista, list)
    assert len(lista) >= 0   # apenas garante que funciona


# --------------------
# HU03 — Buscar por ID
# --------------------
def test_hu03_buscar_feirante_por_id():
    novo_id = feirantes_rep.criar_feirante(
        usuario_id=1,
        nome_estabelecimento="Barraca da Ana",
        link_wpp="https://wa.me/555"
    )

    feirante = feirantes_rep.buscar_feirante_por_id(novo_id)

    assert feirante is not None
    assert feirante["nome_estabelecimento"] == "Barraca da Ana"

