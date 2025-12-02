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
    stmt = select(feirantes)

    if conn is not None:
        result = conn.execute(stmt)
        return [dict(row) for row in result.mappings()]

    with engine.connect() as conn2:
        result = conn2.execute(stmt)
        return [dict(row) for row in result.mappings()]


def buscar_feirante_por_id(id_feirante: int, conn=None):
    stmt = select(feirantes).where(feirantes.c.id == id_feirante)

    if conn is not None:
        result = conn.execute(stmt).mappings().first()
        return dict(result) if result else None

    with engine.connect() as conn2:
        result = conn2.execute(stmt).mappings().first()
        return dict(result) if result else None


def atualizar_feirante(id_feirante: int, novo_nome=None, novo_link=None, conn=None):
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
