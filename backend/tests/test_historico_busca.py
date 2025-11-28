from sqlalchemy import text
import pytest
import sys
import os
from datetime import datetime

current_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.abspath(os.path.join(current_dir, ".."))
sys.path.insert(0, root_dir)

from app.models.connection import engine
from app.models import historico_busca 

ID_USUARIO_TESTE = 888
NOME_USUARIO_TESTE = "Usuario Teste"

@pytest.fixture()
def setup_usuario():
    with engine.begin() as conn:
        try:
            conn.execute(text(f"INSERT INTO usuarios (id, nome) VALUES ({ID_USUARIO_TESTE}, '{NOME_USUARIO_TESTE}')"))
        except Exception:
            pass

    yield ID_USUARIO_TESTE

    with engine.begin() as conn:
        conn.execute(text(f"DELETE FROM historico_buscas WHERE usuario_id = {ID_USUARIO_TESTE}"))
        try:
            conn.execute(text(f"DELETE FROM usuarios WHERE id = {ID_USUARIO_TESTE}"))
        except Exception:
            pass

def test_adicionar_historico_busca_sucesso(setup_usuario):    

    id_historico = historico_busca.adicionar_historico_busca(usuario_id=setup_usuario, produto_buscado="Maçã")
    assert id_historico is not None
    
    historico_db = historico_busca.buscar_historico_por_id(id_historico)
    assert historico_db['produto_buscado'] == "Maçã"
    assert historico_db['usuario_id'] == setup_usuario
    assert historico_db['feirante_buscado'] == ""
    
    historico_busca.deletar_historico_busca(id_historico)

def test_adicionar_historico_busca_feirante(setup_usuario):
    
    id_historico = historico_busca.adicionar_historico_busca(usuario_id=setup_usuario, feirante_buscado="Feirante João")
    assert id_historico is not None
    
    historico_db = historico_busca.buscar_historico_por_id(id_historico)
    assert historico_db['feirante_buscado'] == "Feirante João"
    assert historico_db['produto_buscado'] == ""
    
    historico_busca.deletar_historico_busca(id_historico)

def test_adicionar_historico_busca_completo(setup_usuario):
    
    id_historico = historico_busca.adicionar_historico_busca(usuario_id=setup_usuario, produto_buscado="Banana", feirante_buscado="Feirante Maria")
    assert id_historico is not None
    
    historico_db = historico_busca.buscar_historico_por_id(id_historico)
    assert historico_db['produto_buscado'] == "Banana"
    assert historico_db['feirante_buscado'] == "Feirante Maria"
    
    historico_busca.deletar_historico_busca(id_historico)

def test_validacao_parametros_vazios(setup_usuario):
    
    with pytest.raises(ValueError) as error_info:
        historico_busca.adicionar_historico_busca(usuario_id=setup_usuario)
    assert "pelo menos um parâmetro de busca" in str(error_info.value).lower()

def test_listar_historico_usuario(setup_usuario):
    
    id1 = historico_busca.adicionar_historico_busca(setup_usuario, "Maçã")
    id2 = historico_busca.adicionar_historico_busca(setup_usuario, "Banana")
    id3 = historico_busca.adicionar_historico_busca(setup_usuario, feirante_buscado="Feirante Teste")
    
    lista = historico_busca.listar_historico_buscas(usuario_id=setup_usuario)
    
    assert len(lista) >= 3
    
    produtos_buscados = [h['produto_buscado'] for h in lista if h['produto_buscado']]
    vendedores_buscados = [h['feirante_buscado'] for h in lista if h['feirante_buscado']]
    
    assert "Maçã" in produtos_buscados
    assert "Banana" in produtos_buscados
    assert "Feirante Teste" in vendedores_buscados
    
    historico_busca.deletar_historico_busca(id1)
    historico_busca.deletar_historico_busca(id2)
    historico_busca.deletar_historico_busca(id3)

def test_buscar_historico_por_id(setup_usuario):
    
    id_historico = historico_busca.adicionar_historico_busca(setup_usuario, "Laranja", "Feirante Citrus")
    
    historico = historico_busca.buscar_historico_por_id(id_historico)
    assert historico is not None
    assert historico['id'] == id_historico
    assert historico['produto_buscado'] == "Laranja"
    assert historico['feirante_buscado'] == "Feirante Citrus"
    
    historico_inexistente = historico_busca.buscar_historico_por_id(99999)
    assert historico_inexistente is None
    
    historico_busca.deletar_historico_busca(id_historico)

def test_deletar_historico_busca(setup_usuario):

    id_historico = historico_busca.adicionar_historico_busca(setup_usuario, "Produto para Deletar")
    
    assert historico_busca.buscar_historico_por_id(id_historico) is not None
    
    historico_busca.deletar_historico_busca(id_historico)
    
    assert historico_busca.buscar_historico_por_id(id_historico) is None