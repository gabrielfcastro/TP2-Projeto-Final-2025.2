"""
Módulo de repositório para gerenciamento de avaliações de produtos.

Pode criar, ler, atualizar e deletar avaliações de produtos.
"""

#Garanta que está na pasta backend no terminal antes de rodar:
#make pylint PYLINTFILE=app/models/avaliacoes_produtos_rep.py


from sqlalchemy import select, insert, update, delete
from .connection import engine, metadata

TAMANHO_MAX_COMENTARIO = 500


avaliacoes_produtos = metadata.tables.get("avaliacoes_produtos")
if avaliacoes_produtos is None:
    raise Exception("Tabela 'avaliacoes_produtos' não encontrada no banco.")

def adicionar_avaliacao_produto(produto_id: int, nota: int, comentario: str) -> None:
    """Adiciona uma nova avaliação para um produto.
        Argumentos:
        produto_id (int): ID do produto
        nota (Decimal): Nota da avaliação (1.0 a 5.0)
        comentario (str): Comentário da avaliação

        Se a nota estiver fora do intervalo permitido ou
        se o comentário exceder o tamanho máximo.
    """
    if nota < 1 or nota > 5:
        raise ValueError("A nota deve estar entre 1 e 5")
    if len(comentario) > TAMANHO_MAX_COMENTARIO:
        raise ValueError(f"O comentário não pode exceder {TAMANHO_MAX_COMENTARIO} caracteres.")

    # Inserir a avaliação no banco de dados
    with engine.begin() as conn:
        stmt = insert(avaliacoes_produtos).values(
            produto_id=produto_id,
            nota=nota,
            comentario=comentario
        )
        conn.execute(stmt)

    # Retornar a avaliação que foi criada
    with engine.begin() as conn:
        stmt = select(avaliacoes_produtos).where(
            avaliacoes_produtos.c.produto_id == produto_id,
            avaliacoes_produtos.c.nota == nota,
            avaliacoes_produtos.c.comentario == comentario
        )
        result = conn.execute(stmt).first()
        return result
    return None
