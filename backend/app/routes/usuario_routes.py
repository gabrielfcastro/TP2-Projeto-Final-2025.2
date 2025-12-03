"""
    @file usuario_routes.py
    @brief Este arquivo é responsável pelas rotas do usuário.
"""

from ..models import usuario_rep
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

usuario_bp = Blueprint('usuario_bp', __name__, url_prefix='/api/usuarios')

@usuario_bp.route('/', methods = ['POST'])
def criar_usuario():
    """
        @brief Pega os dados por request do usuário para solicitar no repositório.
        @throws ConnectionError Se a conexão não for estabelecida corretamente.
        @throws LookupError Se o usuário não for encontrado.
        @throws ValueError Se os dados do usuário estiverem inválidos.

        @return Retorna um json com todos os dados servindo como response para o front-end.
    """
    dados = request.json

    if not dados :
        return jsonify({'JSON ausente'}), 400
    
    email = dados.get('email')
    nome = dados.get('nome')
    senha = dados.get('senha')
    tipo_usuario = dados.get('tipo_usuario')

    if not all([email, nome, senha]): 
        return jsonify({'erro':'Dados Ausentes'}),400
    
    try:
        usuario_id = usuario_rep.adicionar_usuario(
            email=email,
            nome=nome,
            senha=senha,
            tipo_usuario=tipo_usuario
        )

        if not usuario_id:
            raise ConnectionError("Falha em salvar o usuário")
        
        access_token = create_access_token(identity=email)

        json = {
                "email": email,
                "nome": nome,
                "tipo_usuario": tipo_usuario,
                "access_token": access_token}
        return jsonify(json), 201
        
    
    except LookupError as e:
        return jsonify({"erro": str(e)}), 404
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    except ConnectionError as e:
        return jsonify({"erro": str(e)}), 500
    
@usuario_bp.route("/login", methods= ['POST'])
def login():
    
    """
        @brief Verifica se o usuario tem login para autenticação
        @throws ConnectionError Se a conexão não for estabelecida corretamente.
        @throws LookupError Se o usuário não for encontrado.
        @throws ValueError Se os dados do usuário estiverem inválidos.

        @return Retorna o email junto com o token de acesso do login.
    """
    dados = request.json
    if not dados:
        return jsonify({'erro':'JSON ausente'}),400
    
    email = dados.get('email')
    senha = dados.get('senha')

    if not all([email,senha]):
        return jsonify({'erro': 'Dados ausentes'}),400
    
    try:
        usuario = usuario_rep.verificar_credenciais(email,senha)
        access_token = create_access_token(identity=email)

        json = {"email": usuario['email'],
                "access_token": access_token}
        return jsonify(json), 200
    
    except LookupError as e:
        return jsonify({"erro": str(e)}), 401
    
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    
    except ConnectionError as e:
        return jsonify({"erro": str(e)}), 500   
