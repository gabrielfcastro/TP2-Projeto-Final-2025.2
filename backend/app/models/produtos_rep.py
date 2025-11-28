from sqlalchemy import select, insert, update, delete
from .connection import engine, metadata
import re

PADRAO_NOME = r"^[A-Za-z][A-Za-z ]{4,49}$"
PADRAO_PRECO = r"^\d+(\.\d{1,2})?$"
TAMANHO_MAX_DESCRICAO = 500

produtos = metadata.tables.get("produtos")
if produtos is None:
    raise Exception("Tabela 'produtos' não encontrada no banco.")

feirantes = metadata.tables.get("feirantes")
if feirantes is None:
    raise Exception("Tabela 'feirantes' não encontrada no banco.")

def adicionar_produto(feirante_id: int, nome: str, preco: float, descricao: str = None, latitude: float = None , longitude: float = None):

    if not re.match(PADRAO_NOME, nome):
        raise ValueError ("Nome do produto inválido :\n"
                          "-Deve conter entre 5 e 50 caracteres.")

    if float(preco) <= 0:
        raise ValueError ("Preço Inválido : \n"
                          "- O valor deve ser maior que zero.")

    if not re.match(PADRAO_PRECO, str(preco)):
        raise ValueError ("NPreço do produto inválido :\n"
                          "-Deve conter EXATAMENTE duas casas decimais.")

    if descricao and len(descricao) > TAMANHO_MAX_DESCRICAO:
        raise ValueError (f"Descrição Inválida : \n"
                          f"- Deve conter no máximo {TAMANHO_MAX_DESCRICAO} caracteres.")


    stmt = insert(produtos).values(
        feirante_id = feirante_id,
        nome = nome,
        descricao = descricao,
        preco = preco,
        latitude = latitude,
        longitude = longitude
    )

    with engine.begin() as conn:
        result = conn.execute(stmt)
        if result.inserted_primary_key:
            return result.inserted_primary_key[0]
        return None

def listar_produtos(id_produto = None, feirante_id = None):

    stmt = select(produtos)

    if id_produto:
        stmt = stmt.where(produtos.c.id == id_produto)

    if feirante_id:
        stmt = stmt.where(produtos.c.feirante_id == feirante_id)

    with engine.connect() as conn:
        result = conn.execute(stmt)
        lista_produtos = [dict(row) for row in result.mappings()]

    return lista_produtos

def buscar_produto_por_id(id_produto: int):

    with engine.connect() as conn:
        stmt = select(produtos).where(produtos.c.id == id_produto)
        result = conn.execute(stmt).mappings().first()

        if result:
            return dict(result)
        else:
            return None

def deletar_produto(id_produto: int):

    stmt = delete(produtos).where(produtos.c.id == id_produto)

    with engine.begin() as conn:
        result = conn.execute(stmt)
        if result.rowcount == 0:
            raise ValueError(f"Produto com ID {id_produto} não encontrado.")