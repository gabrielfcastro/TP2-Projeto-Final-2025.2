from ..models import usuario_rep
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token

usuario_bp = Blueprint('usuario_bp', __name__, url_prefix='/api/usuarios')

@usuario_bp.route('/', methods = ['POST'])
def criar_usuario():
    dados = request.json

    if not dados :
        return jsonify({'JSON ausente'}), 400
    
    email = dados.get('email')
    nome = dados.get('nome')
    senha = dados.get('senha')

    if not all([email, nome, senha]): 
        return jsonify({'erro':'Dados Ausentes'}),400
    
    try:
        usuario_id = usuario_rep.adicionar_usuario(
            email=email,
            nome=nome,
            senha=senha,
            tipo_usuario="Usuario"
        )

        if not usuario_id:
            raise ConnectionError("Falha em salvar o usuário")
        
        access_token = create_access_token(identity=email)

        json = {
                "email": email,
                "nome": nome,
                "access_token": access_token}
        return jsonify(json), 201
        
    
    except LookupError as e:
        return jsonify({"erro": str(e)}), 404
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    except ConnectionError as e:
        return jsonify({"erro": str(e)}), 500