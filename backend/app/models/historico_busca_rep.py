from sqlalchemy import select, insert, update, delete
from .connection import engine, metadata
from datetime import datetime

historico_buscas = metadata.tables.get("historico_buscas")
if historico_buscas is None:
    raise Exception("Tabela 'historico_buscas' não encontrada no banco.")

def adicionar_historico_busca(usuario_id: int, produto_buscado: str = "", feirante_buscado: str = ""):

    if not produto_buscado and not feirante_buscado:
        raise ValueError("Pelo menos um parâmetro de busca deve ser fornecido: produto ou feirante.")
    
    stmt = insert(historico_buscas).values(
        usuario_id=usuario_id,
        produto_buscado=produto_buscado,
        feirante_buscado=feirante_buscado,
    )
    
    with engine.begin() as conn:
        result = conn.execute(stmt)
        if result.inserted_primary_key:
            return result.inserted_primary_key[0]
        return None

def listar_historico_buscas(usuario_id=None, historico_id=None):

    stmt = select(historico_buscas)
    
    if historico_id:
        stmt = stmt.where(historico_buscas.c.id == historico_id)
    
    if usuario_id:
        stmt = stmt.where(historico_buscas.c.usuario_id == usuario_id)
    
    stmt = stmt.order_by(historico_buscas.c.id.desc())

    with engine.connect() as conn:
        result = conn.execute(stmt)
        lista_historico = [dict(row) for row in result.mappings()]
    
    return lista_historico

def buscar_historico_por_id(historico_id: int):

    with engine.connect() as conn:
        stmt = select(historico_buscas).where(historico_buscas.c.id == historico_id)
        result = conn.execute(stmt).mappings().first()
        
        if result:
            return dict(result)
        else:
            return None

def deletar_historico_por_usuario(usuario_id: int):

    stmt = delete(historico_buscas).where(historico_buscas.c.usuario_id == usuario_id)
    
    with engine.begin() as conn:
        result = conn.execute(stmt)
        return result.rowcount  