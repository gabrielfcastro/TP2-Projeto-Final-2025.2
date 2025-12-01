"""
Testes para o módulo de repositório de avaliações de produtos.

Contém testes unitários para validar as operações de banco de dados
de avaliações de produtos.
"""

#Garanta que está na pasta backend no terminal antes de rodar:
#python -m pylint .\tests\test_avaliacoes_produtos_rep.py

import sys
import os
from sqlalchemy import text
import pytest

from app.models.connection import engine
from app.models import avaliacoes_produtos_rep

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, root_dir)
