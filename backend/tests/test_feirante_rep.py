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

import sys
import os
import pytest

current_dir = os.path.dirname(os.path.abspath(__file__))
backend_dir = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, backend_dir)

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


# --------------------
# HU04 — Atualizar feirante
# --------------------
def test_hu04_atualizar_feirante():
    novo_id = feirantes_rep.criar_feirante(
        usuario_id=2,
        nome_estabelecimento="Feira da Tati",
        link_wpp="https://wa.me/999"
    )

    feirantes_rep.atualizar_feirante(
        novo_id,
        novo_nome="Feira da Tati Atualizada",
        novo_link="https://wa.me/000"
    )

    atualizado = feirantes_rep.buscar_feirante_por_id(novo_id)

    assert atualizado["nome_estabelecimento"] == "Feira da Tati Atualizada"
    assert atualizado["link_wpp"] == "https://wa.me/000"


# --------------------
# HU05 — Excluir feirante
# --------------------
def test_hu05_deletar_feirante():
    novo_id = feirantes_rep.criar_feirante(
        usuario_id=3,
        nome_estabelecimento="Barraca Temporária",
        link_wpp="https://wa.me/111"
    )

    feirantes_rep.deletar_feirante(novo_id)

    feirante = feirantes_rep.buscar_feirante_por_id(novo_id)
    assert feirante is None
