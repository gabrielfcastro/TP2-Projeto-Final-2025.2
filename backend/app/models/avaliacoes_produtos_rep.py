"""!
    @file avaliacoes_produtos_rep.py
    @brief Este arquivo é responsável pela persistência dos dados das avaliações dos produtos.
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
    """!
        @brief Adiciona uma nova avaliação de produto ao banco de dados.

        @param produto_id ID do produto a ser avaliado.
        @param nota Nota da avaliação.
        @param comentario Comentário da avaliação.
        @param data Data da avaliação.

        @pre Nota Deve ser um número decimal entre 1.0 e 5.0, com até 1 casa decimal.
        @pre Comentario Deve ter no máximo 500 caracteres.
        @post Insere uma nova avaliação na tabela 'avaliacoes_produtos' do banco de dados.
        @throws ValueError Se a nota ou o comentário forem inválidos.
        @return A avaliação criada.

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
    """!
        @brief Deleta uma avaliação de produto do banco de dados.

        @param avaliacao_id ID da avaliação a ser deletada.

        @pre avaliacao_id Deve existir no banco de dados.
        @post Remove a avaliação da tabela 'avaliacoes_produtos' do banco de dados.
    """
    with engine.begin() as conn:
        stmt = delete(avaliacoes_produtos).where(
            avaliacoes_produtos.c.id == avaliacao_id
        )
        conn.execute(stmt)

def listar_avaliacoes_produtos(produto_id: int):
    """!
        @brief Lista todas as avaliações de um produto específico.

        @param produto_id ID do produto cujas avaliações serão listadas.

        @return Retorna uma lista de dicionários com as avaliações do produto.
    """
    with engine.connect() as conn:
        stmt = select(avaliacoes_produtos).where(
            avaliacoes_produtos.c.produto_id == produto_id
        )
        result = conn.execute(stmt)
        lista_avaliacoes = [dict(row) for row in result.mappings()]

    return lista_avaliacoes

def calcular_media_avaliacoes_produto(produto_id: int) -> Decimal:
    """!
         @brief Calcula a média das avaliações de um produto específico.

        @param produto_id ID do produto cujas avaliações serão calculadas.

        @return Retorna a média das avaliações do produto como um Decimal com 1 casa decimal.
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

def atualizar_media_avaliacoes_tabela_produtos(produto_id: int):
    """!
        @brief Atualiza a média das avaliações na tabela de produtos.

        @param produto_id ID do produto cuja média será atualizada.

        @post Atualiza o campo 'avaliacao_media' na tabela 'produtos' com a média calculada.
    """
    media = calcular_media_avaliacoes_produto(produto_id)

    with engine.begin() as conn:
        stmt = update(produtos).where(
            produtos.c.id == produto_id
        ).values(
            avaliacao_media=media
        )
        conn.execute(stmt)

def calcular_total_avaliacoes_produtos(produto_id: int) -> int:
    """!
        @brief Calcula o total de avaliações de um produto específico.

        @param produto_id ID do produto cujas avaliações serão contadas.

        @return Retorna o total de avaliações do produto como um inteiro.
    """
    with engine.connect() as conn:
        stmt = select(avaliacoes_produtos).where(
            avaliacoes_produtos.c.produto_id == produto_id
        )
        result = conn.execute(stmt)
        total_avaliacoes = len(result.fetchall())

    return total_avaliacoes

def atualizar_total_avaliacoes_tabela_produtos(produto_id: int):
    """!
        @brief Atualiza o total de avaliações na tabela de produtos.

        @param produto_id ID do produto cujo total será atualizado.
    """
    total = calcular_total_avaliacoes_produtos(produto_id)

    with engine.begin() as conn:
        stmt = update(produtos).where(
            produtos.c.id == produto_id
        ).values(
            total_avaliacoes=total
        )
        conn.execute(stmt)
