from .connection import engine, metadata
from sqlalchemy import select, insert, update, delete
import re
import bcrypt

PADRAO_NOME = r"^[a-zA-Z\s]{2,20}$"
PADRAO_SENHA = r"^(?=.*[A-Z])(?=.*[!@#$%&*])(?=.*[0-9])(?=.*[a-z]).{8,16}$"
PADRAO_EMAIL = r"^[A-Za-z0-9.-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{,65}$"
PADRAO_PAPEL = r"^(Usuario|Cliente|Feirante|Admin)$"

usuario = metadata.tables.get("usuarios")
if usuario is None:
    raise ConnectionError("Tabela 'usuario' não encontrada no banco.")

def adicionar_usuario(email: str, senha: str, nome: str, tipo_usuario: str):
    if not re.match(PADRAO_NOME, nome):
        raise ValueError ("Nome Inválido :\n"
                            "-Deve conter apenas letras e espaço, sem acentuação \n"
                            "-Deve conter entre 2 à 20 caracteres.")

    if not re.match(PADRAO_EMAIL, email):
        raise ValueError("Email Inválido :\n" \
                            "- Deve conter padrao email : parte-local@dominio \n"
                            "- parte-local pode conter letras, numeros, hifen (-) e ponto (.) \n" \
                            "- dominio pode conter letras, numeros e hifen (-) separados por ponto (.) \n" \
                            "- Deve conter no máximo 64 caracteres. ")

    if not re.match(PADRAO_SENHA, senha):
        raise ValueError ("Senha Inválida :\n"
                            "- Deve conter pelo menos 1 letra Maiúscula, 1 letra Minúscula, 1 numérico e 1 caractere especial \n"
                            "- Deve conter entre 8 à 15 caracteres.")

    if not re.match(PADRAO_PAPEL, tipo_usuario):
        raise ValueError ("Papel Inexistente: \n"
                        "- Deve ser um dos seguintes: Cliente, Feirante, Admin. ")

    senha_hash = bcrypt.hashpw(senha.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

    stmt = insert(usuario).values(email=email,senha=senha_hash, nome=nome, tipo_usuario=tipo_usuario)

    with engine.begin() as conn:
        result = conn.execute(stmt)
        if result.inserted_primary_key:
            return result.inserted_primary_key[0]
        return None

def listar_usuarios(email = None, id = None):

    stmt = select(usuario.c.id, usuario.c.email, usuario.c.nome, usuario.c.tipo_usuario)

    if id:
        stmt = stmt.where(usuario.c.id == id)
    elif email:
        stmt = stmt.where(usuario.c.email == email)
        
    with engine.connect() as conn:
        result = conn.execute(stmt)
        usuarios = [dict(row) for row in result.mappings()]

    if id and not usuarios:
        raise LookupError("Usuario não encontrado")
    return usuarios

def verificar_credenciais(email: str, senha_enviada: str):

    stmt = select(usuario).where(usuario.c.email == email)
    
    with engine.connect() as conn:
        resultado = conn.execute(stmt).mappings().first()
        if resultado:
            usuario_encontrado = dict(resultado)
            senha_banco = usuario_encontrado['senha']

    if usuario_encontrado is None:
        raise LookupError("Credenciais inválidas")
    
    senha_enviada_bytes = senha_enviada.encode('utf-8')
    senha_hasheada_bytes = senha_banco.encode('utf-8')
    
    senha_bate = bcrypt.checkpw(senha_enviada_bytes, senha_hasheada_bytes)

    if not senha_bate:
        raise LookupError("Credenciais inválidas")
    
    return usuario_encontrado 

def deletar_usuario(email:str):
    stmt = delete(usuario).where(usuario.c.email == email)

    with engine.begin() as conn:
        result = conn.execute(stmt)
        if result.rowcount == 0:
            raise LookupError("Nenhum usuário encontrado com esse id.")
    print(f"Usuário com email {email} removido com sucesso!")