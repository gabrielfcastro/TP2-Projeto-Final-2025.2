""""!
    @file feirantes_rep.py
    
    @brief Este arquivo é responsável pela persistência dos dados dos feirantes.
"""

import re
from .connection import engine, metadata
from sqlalchemy import select, insert, update, delete

# --- Validações ---
PADRAO_NOME_ESTAB = r"^.{3,100}$"

# --- Carregar tabela ---
feirantes = metadata.tables.get("feirantes")
if feirantes is None:
    raise Exception("Tabela 'feirantes' não encontrada no banco.")


# ============================================================
#   CRUD com suporte a conexão externa (para testes)
# ============================================================

def criar_feirante(usuario_id: int, nome_estabelecimento: str, link_wpp: str, conn=None):
    """!
        @brief Cria um novo feirante no banco de dados.

        @param usuario_id ID do usuário associado ao feirante.
        @param nome_estabelecimento Nome do estabelecimento do feirante.
        @param link_wpp Link do WhatsApp do feirante.

        @pre nome_estabelecimento Deve ter pelo menos 3 caracteres.
        @pre link_wpp Deve ser uma URL válida.

        @post Insere um novo registro na tabela 'feirantes' do banco de dados.
        @return ID do feirante criado.
    """

    # Validações
    if not re.match(PADRAO_NOME_ESTAB, nome_estabelecimento):
        raise ValueError("Nome do estabelecimento inválido (mínimo 3 caracteres).")
    
    if not link_wpp:
        raise ValueError("Link do WhatsApp é obrigatório.")

    stmt = insert(feirantes).values(
        usuario_id=usuario_id,
        nome_estabelecimento=nome_estabelecimento,
        link_wpp=link_wpp
    )

    # Se receber conexão externa (TESTES)
    if conn is not None:
        result = conn.execute(stmt)
        return result.inserted_primary_key[0]

    # Execução normal
    with engine.begin() as conn2:
        result = conn2.execute(stmt)
        return result.inserted_primary_key[0]


def listar_feirantes(conn=None):
    """!
        @brief Lista todos os feirantes cadastrados no banco de dados.

        @post Retorna uma lista de dicionários, cada um representando um feirante.
        @return Lista de feirantes.
        
    """
    stmt = select(feirantes)

    if conn is not None:
        result = conn.execute(stmt)
        return [dict(row) for row in result.mappings()]

    with engine.connect() as conn2:
        result = conn2.execute(stmt)
        return [dict(row) for row in result.mappings()]


def buscar_feirante_por_id(id_feirante: int, conn=None):
    """!
        @brief Busca um feirante pelo seu ID.

        @param id_feirante ID do feirante a ser buscado.

        @return Dicionário com os dados do feirante ou None. 
        
    """
    stmt = select(feirantes).where(feirantes.c.id == id_feirante)

    if conn is not None:
        result = conn.execute(stmt).mappings().first()
        return dict(result) if result else None

    with engine.connect() as conn2:
        result = conn2.execute(stmt).mappings().first()
        return dict(result) if result else None


def atualizar_feirante(id_feirante: int, novo_nome=None, novo_link=None, conn=None):
    """!
        @brief Atualiza os dados de um feirante no banco de dados.

        @param id_feirante ID do feirante a ser atualizado.
        @param novo_nome Novo nome do estabelecimento (opcional).
        @param novo_link Novo link do WhatsApp (opcional).

        @pre novo_nome Se fornecido, deve ter pelo menos 3 caracteres.
        @pre novo_link Se fornecido, deve ser uma URL válida.

        @post Atualiza os dados do feirante na tabela 'feirantes' do banco de dados. 
        
    """
    novos_valores = {}

    if novo_nome:
        if not re.match(PADRAO_NOME_ESTAB, novo_nome):
            raise ValueError("Nome inválido.")
        novos_valores["nome_estabelecimento"] = novo_nome
    
    if novo_link:
        novos_valores["link_wpp"] = novo_link

    if not novos_valores:
        raise ValueError("Nenhum dado para atualizar.")

    stmt = update(feirantes).where(feirantes.c.id == id_feirante).values(**novos_valores)

    # Testes
    if conn is not None:
        result = conn.execute(stmt)
        if result.rowcount == 0:
            raise ValueError(f"Feirante {id_feirante} não encontrado.")
        return

    # Execução normal
    with engine.begin() as conn2:
        result = conn2.execute(stmt)
        if result.rowcount == 0:
            raise ValueError(f"Feirante {id_feirante} não encontrado.")


def deletar_feirante(id_feirante: int, conn=None):
    """!
        @brief Deleta um feirante do banco de dados.

        @param id_feirante ID do feirante a ser deletado.

        @pre id_feirante Deve existir no banco de dados.
        @post Remove o feirante da tabela 'feirantes' do banco de dados. 
        
    """
    stmt = delete(feirantes).where(feirantes.c.id == id_feirante)

    # Testes
    if conn is not None:
        result = conn.execute(stmt)
        if result.rowcount == 0:
            raise ValueError(f"Feirante {id_feirante} não encontrado.")
        return

    # Execução normal
    with engine.begin() as conn2:
        result = conn2.execute(stmt)
        if result.rowcount == 0:
            raise ValueError(f"Feirante {id_feirante} não encontrado.")
