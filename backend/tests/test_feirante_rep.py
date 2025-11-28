import os
import sys
import tempfile
import pytest
from sqlalchemy import create_engine, MetaData, Table, Column, Integer, String, ForeignKey


current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, root_dir)

from app.models.feirantes_rep import feirantesRepository


@pytest.fixture
def temp_db(monkeypatch):

    temp_file = tempfile.NamedTemporaryFile(delete=False)
    temp_path = temp_file.name
    temp_file.close()

    engine = create_engine(f"sqlite:///{temp_path}", echo=False)
    metadata = MetaData()

    feirantes_table = Table(
        "feirantes", metadata,
        Column("id", Integer, primary_key=True, autoincrement=True),
        Column("usuario_id", Integer),
        Column("nome_estabelecimento", String, nullable=False),
        Column("link_wpp", String, nullable=False),
        Column("avaliacao_media", String, default="0.00"),
        Column("total_avaliacoes", Integer, default=0)
    )

    metadata.create_all(engine)

    monkeypatch.setattr("app.models.feirantes_rep.engine", engine)
    monkeypatch.setattr("app.models.feirantes_rep.metadata", metadata)
    monkeypatch.setattr("app.models.feirantes_rep.feirantesTable", feirantes_table)

    yield engine
    engine.dispose()
    os.remove(temp_path)  


def test_criar_feirante(temp_db):
    dados = {
        "usuario_id": 1,
        "nome_estabelecimento": "Barraca do João",
        "link_wpp": "https://wa.me/123456789"
    }

    novo_id = feirantesRepository.criar(dados)
    assert novo_id == 1, "O ID gerado deveria ser 1"


def test_listar_feirantes(temp_db):

    feirantesRepository.criar({
        "usuario_id": 1,
        "nome_estabelecimento": "Barraca A",
        "link_wpp": "https://wa.me/a"
    })
    feirantesRepository.criar({
        "usuario_id": 2,
        "nome_estabelecimento": "Barraca B",
        "link_wpp": "https://wa.me/b"
    })

    lista = feirantesRepository.listar()
    assert len(lista) == 2
    assert lista[0]["nome_estabelecimento"] == "Barraca A"


def test_buscar_por_id(temp_db):
    new_id = feirantesRepository.criar({
        "usuario_id": 5,
        "nome_estabelecimento": "Feira X",
        "link_wpp": "https://wa.me/x"
    })

    feirante = feirantesRepository.buscarPorId(new_id)
    assert feirante is not None
    assert feirante["nome_estabelecimento"] == "Feira X"


def test_atualizar_feirante(temp_db):
    new_id = feirantesRepository.criar({
        "usuario_id": 3,
        "nome_estabelecimento": "Antigo Nome",
        "link_wpp": "http://old"
    })

    atualizado = feirantesRepository.atualizar(new_id, {
        "nome_estabelecimento": "Novo Nome",
        "link_wpp": "http://new"
    })

    assert atualizado is True

    feirante = feirantesRepository.buscarPorId(new_id)
    assert feirante["nome_estabelecimento"] == "Novo Nome"


def test_deletar_feirante(temp_db):
    new_id = feirantesRepository.criar({
        "usuario_id": 9,
        "nome_estabelecimento": "Barraca Z",
        "link_wpp": "http://z"
    })

    deletado = feirantesRepository.deletar(new_id)
    assert deletado is True

    feirante = feirantesRepository.buscarPorId(new_id)
    assert feirante is None
