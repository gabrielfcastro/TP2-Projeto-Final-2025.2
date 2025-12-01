"""
Módulo de repositório para gerenciamento de avaliações de produtos.

Pode criar, ler, atualizar e deletar avaliações de produtos.
"""

#Garanta que está na pasta backend no terminal antes de rodar:
#python -m pylint .\app\models\avaliacoes_produtos_rep.py

from sqlalchemy import select, insert, update, delete
from .connection import engine, metadata

TAMANHO_MAX_COMENTARIO = 500


avaliacoes_produto = metadata.tables.get("avaliacoes_produto")
