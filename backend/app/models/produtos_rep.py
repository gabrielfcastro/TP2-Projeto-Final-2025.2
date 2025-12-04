"""!
    @file produtos_rep.py
    @brief Este arquivo é responsável pela persistência dos dados dos produtos.

"""

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
    """!
        @brief Adiciona um novo produto ao banco de dados.

        @param feirante_id ID do feirante que está cadastrando o produto.
        @param nome Nome do produto.
        @param preco Preço do produto.
        @param descricao Descrição do produto (opcional).
        @param latitude Latitude da localização do produto (opcional).
        @param longitude Longitude da localização do produto (opcional).

        @pre nome Deve conter entre 5 e 50 caracteres.
        @pre preco Deve ser um valor maior que zero e conter exatamente duas casas decimais.
        @pre descricao Deve conter no máximo 500 caracteres, se fornecida.

        @post Insere um novo produto na tabela 'produtos' do banco de dados.

        @throws ValueError Se algum dos parâmetros fornecidos for inválido.
        @return ID do produto criado.
        
    """
    if not re.match(PADRAO_NOME, nome):
        raise ValueError ("Nome do produto inválido :\n"
                          "- Deve conter entre 5 e 50 caracteres.")

    if float(preco) <= 0:
        raise ValueError ("Preço Inválido : \n"
                          "- O valor deve ser maior que zero.")

    if not re.match(PADRAO_PRECO, str(preco)):
        raise ValueError ("NPreço do produto inválido :\n"
                          "- Deve conter EXATAMENTE duas casas decimais.")

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
    """!
        @brief Lista produtos do banco de dados com base em filtros opcionais.

        @param id_produto ID do produto a ser buscado (opcional).
        @param feirante_id ID do feirante para filtrar os produtos (opcional).

        @post Busca produtos na tabela 'produtos' do banco de dados com base nos filtros fornecidos.

        @return Lista de dicionários contendo os dados dos produtos encontrados. 
        
    """
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
    """!
        @brief Busca um produto pelo seu ID.

        @param id_produto ID do produto a ser buscado.

        @post Busca o produto na tabela 'produtos' do banco de dados.

        @return Dicionário contendo os dados do produto encontrado ou None se não encontrado. 
        
    """

    with engine.connect() as conn:
        stmt = select(produtos).where(produtos.c.id == id_produto)
        result = conn.execute(stmt).mappings().first()

        if result:
            return dict(result)
        else:
            return None

def deletar_produto(id_produto: int):
    """!
        @brief Deleta um produto do banco de dados.

        @param id_produto ID do produto a ser deletado.

        @pre id_produto Deve existir no banco de dados.
        @post Remove o produto da tabela 'produtos' do banco de dados.
        @throws ValueError Se o produto com o ID fornecido não for encontrado.
    """

    stmt = delete(produtos).where(produtos.c.id == id_produto)

    with engine.begin() as conn:
        result = conn.execute(stmt)
        if result.rowcount == 0:
            raise ValueError(f"Produto com ID {id_produto} não encontrado.")