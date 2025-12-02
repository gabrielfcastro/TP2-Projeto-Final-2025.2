"""
Módulo de repositório para gerenciamento de avaliações de produtos.

Pode criar, ler, atualizar e deletar avaliações de produtos.
"""

#Garanta que está na pasta backend no terminal antes de rodar:
#make pylint PYLINTFILE=app/models/avaliacoes_produtos_rep.py

from decimal import Decimal
from datetime import datetime

from sqlalchemy import select, insert, update, delete
from .connection import engine, metadata

TAMANHO_MAX_COMENTARIO = 500


avaliacoes_produtos = metadata.tables.get("avaliacoes_produtos")
if avaliacoes_produtos is None:
    raise Exception("Tabela 'avaliacoes_produtos' não encontrada no banco.")

produtos = metadata.tables.get("produtos")
if produtos is None:
    raise Exception("Tabela 'produtos' não encontrada no banco.")

def adicionar_avaliacao_produto(produto_id: int, nota: str, comentario: str, data: datetime):
    """Adiciona uma nova avaliação para um produto.
        Argumentos:
        produto_id (int): ID do produto
        nota (Decimal): Nota da avaliação (1.0 a 5.0)
        comentario (str): Comentário da avaliação

        Lança:
        Se a nota estiver fora do intervalo permitido ou
        se o comentário exceder o tamanho máximo.
        Lança ValueError.

        Retorna:
        A avaliação criada.
    """
    if nota is None:
        raise ValueError("A nota não pode ser nula.")

    try:
        nota_decimal = Decimal(nota)
    except Exception as exc:
        raise ValueError("O valor fornecido não é um número decimal válido.") from exc

    #verifica se a nota está entre 1.0 e 5.0
    if nota_decimal < Decimal('1.0'):
        raise ValueError("A nota não pode ser menor que 1.0.")

    if nota_decimal > Decimal('5.0'):
        raise ValueError("A nota não pode ser maior que 5.0.")

    #verifica se a nota tem mais de 1 casa decimal
    if nota_decimal.as_tuple().exponent < -1:
        raise ValueError("A nota não pode ter mais de 1 casa decimal.")

    if len(comentario) > TAMANHO_MAX_COMENTARIO:
        raise ValueError(f"O comentário não pode exceder {TAMANHO_MAX_COMENTARIO} caracteres.")

    # Inserir a avaliação no banco de dados
    with engine.begin() as conn:
        stmt = insert(avaliacoes_produtos).values(
            produto_id=produto_id,
            nota=nota_decimal,
            comentario=comentario,
            data_avaliacao=data
        )
        conn.execute(stmt)

    # Retornar a avaliação que foi criada
    with engine.begin() as conn:
        stmt = select(avaliacoes_produtos).where(
            avaliacoes_produtos.c.produto_id == produto_id,
            avaliacoes_produtos.c.nota == nota_decimal,
            avaliacoes_produtos.c.comentario == comentario,
            avaliacoes_produtos.c.data_avaliacao == data
        )
        result = conn.execute(stmt).first()
        return result
    return None

def deletar_avaliacao_produto(avaliacao_id: int):
    """Deleta uma avaliação de produto pelo seu ID.
        Argumentos:
        avaliacao_id (int): ID da avaliação a ser deletada.
    """
    with engine.begin() as conn:
        stmt = delete(avaliacoes_produtos).where(
            avaliacoes_produtos.c.id == avaliacao_id
        )
        conn.execute(stmt)

def listar_avaliacoes_produtos(produto_id: int):
    """Lista todas as avaliações de um produto específico.
        Argumentos:
        produto_id (int): ID do produto cujas avaliações serão listadas.

        Retorna:
        Lista de avaliações do produto.
    """
    with engine.connect() as conn:
        stmt = select(avaliacoes_produtos).where(
            avaliacoes_produtos.c.produto_id == produto_id
        )
        result = conn.execute(stmt)
        lista_avaliacoes = [dict(row) for row in result.mappings()]

    return lista_avaliacoes

def calcular_media_avaliacoes_produto(produto_id: int) -> Decimal:
    """Calcula a média das avaliações de um produto específico.
        Argumentos:
        produto_id (int): ID do produto cujas avaliações serão consideradas.

        Retorna:
        A média das notas das avaliações do produto como Decimal.
    """
    with engine.connect() as conn:
        stmt = select(avaliacoes_produtos.c.nota).where(
            avaliacoes_produtos.c.produto_id == produto_id
        )
        result = conn.execute(stmt)
        notas = [row['nota'] for row in result.mappings()]

    if not notas:
        return Decimal('0.0')

    soma_notas = sum(notas)
    media = soma_notas / Decimal(len(notas))
    return media.quantize(Decimal('0.10')) 
