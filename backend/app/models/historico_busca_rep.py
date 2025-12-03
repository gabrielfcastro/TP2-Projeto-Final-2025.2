"""!
    @file historico_busca_rep.py
    @brief Este arquivo é responsável pelo CRUD do Histórico de Busca.
"""

from sqlalchemy import select, insert, update, delete
from .connection import engine, metadata
from datetime import datetime

historico_buscas = metadata.tables.get("historico_buscas")
if historico_buscas is None:
    raise Exception("Tabela 'historico_buscas' não encontrada no banco.")

def adicionar_historico_busca(usuario_id: int, produto_buscado: str = "", feirante_buscado: str = ""):

    """!
        @brief Cria uma nova entrada no histórico de busca do usuário.
        
        @details Insere novos registros na tabela do histórico de busca
        com os parâmetros fornecidos pelo usuário.
        
        @param[in] usuario_id ID do usuário que está realizando a busca.
        @param[in] produto_buscado Nome do produto buscado (opcional).
        @param[in] feirante_buscado Nome do feirante buscado (opcional).
        
        @throws ValueError Se os dados do usuário estiverem inválidos ou se nenhum
                           parâmetro de busca for fornecido.
        @throws Exception Para erros de banco de dados ou se a tabela não existir.

        @return A ID da entrada criada no histórico de busca.
    """

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

    """!
        @brief Lista todas as entradas do histórico de busca.
        
        @details Retorna uma lista com os registros da tabela
        de Histórico de Busca de um usuário específico.
        
        @param[in] usuario_id ID do usuário que está realizando a busca.
        @param[in] histrico_id ID do histórico a ser retornado (opcional).
        
        @throws Exception Para erros de banco de dados.

        @return Retorna uma lista de dicionários, onde cada dicionário representa
                uma entrada do histórico.
    """

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
    
    """!
        @brief Busca um registro específico pelo seu ID.
        
        @details Retorna uma entrada específica através do seu ID na
        tabela de Histórico de Busca.
        
        @param[in] histrico_id ID do histórico a ser retornado.
        
        @throws Exception Para erros de banco de dados.

        @return Retorna um dicionário com os dados da entrada do histórico.
    """

    with engine.connect() as conn:
        stmt = select(historico_buscas).where(historico_buscas.c.id == historico_id)
        result = conn.execute(stmt).mappings().first()
        
        if result:
            return dict(result)
        else:
            return None

def deletar_historico_por_usuario(usuario_id: int):
    
    """!
        @brief Deleta o histórico de busca de um usuário específico.
        
        @details Deleta todas os registros na tabela de Histórico de 
        Busca relacionados a um usuário específico.
        
        @param[in] usuario_id ID do usuário cujo histórico será removido.
        
        @throws Exception Para erros de banco de dados.

        @return Retorna o número de registros removidos.
    """

    stmt = delete(historico_buscas).where(historico_buscas.c.usuario_id == usuario_id)
    
    with engine.begin() as conn:
        result = conn.execute(stmt)
        return result.rowcount  

def deletar_historico_busca(historico_id: int):
    """!
        @brief Deleta uma entrada específica no histórico.
        
        @details Deleta um registro específico na tabela de 
        Histórico de Busca.
        
        @param[in] historico_id ID da entrada que será removida.
        
        @throws Exception Para erros de banco de dados.
        @throws ValueError Se o histórico com o ID especificado não for encontrado.

        @return Retorna o número de registros removidos.
    """
    stmt = delete(historico_buscas).where(historico_buscas.c.id == historico_id)
    
    with engine.begin() as conn:
        result = conn.execute(stmt)
        if result.rowcount == 0:
            raise ValueError(f"Histórico de busca com ID {historico_id} não encontrado.")
        return result.rowcount