from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import feirantes_rep, usuario_rep
from flask import Blueprint, request, jsonify

feirante_bp = Blueprint('feirante_bp', __name__, url_prefix='/api/feirantes')

@feirante_bp.route('/', methods=['POST'])
@jwt_required()
def criar_feirante():
    dados = request.json
    email_usuario_logado = get_jwt_identity()

    if not dados:
        return jsonify({'erro': 'JSON ausente'}), 400

    nome_estabelecimento = dados.get('nome_estabelecimento')
    link_wpp = dados.get('link_wpp')

    if not all([nome_estabelecimento, link_wpp]):
        return jsonify({'erro': 'Dados obrigatórios (nome_estabelecimento, link_wpp) ausentes.'}), 400

    try:
        usuarios_encontrados = usuario_rep.listar_usuarios(email = email_usuario_logado)

        if not usuarios_encontrados:
            return jsonify({'erro': 'Usuário do token não encontrado no banco.'}), 404

        usuario_id = usuarios_encontrados[0]['id']

        id_criado = feirantes_rep.criar_feirante(
            usuario_id = usuario_id,
            nome_estabelecimento = nome_estabelecimento,
            link_wpp = link_wpp
        )

        if not id_criado:
            raise ConnectionError("Falha ao salvar o feirante.")

        feirante_criado = feirantes_rep.buscar_feirante_por_id(id_criado)
        return jsonify(feirante_criado), 201

    except ValueError as e:
        return jsonify({"erro": str(e)}), 400

    except LookupError as e:
        return jsonify({"erro": str(e)}), 404

    except ConnectionError as e:
        return jsonify({"erro": str(e)}), 500

    except Exception as e:
        return jsonify({"erro": f"Erro inesperado: {str(e)}"}), 500

@feirante_bp.route('/', methods=['GET'])
def listar_todos_feirantes():
    try:
        feirantes = feirantes_rep.listar_feirantes()
        return jsonify(feirantes), 200

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@feirante_bp.route('/<int:id_feirante>', methods=['GET'])
def buscar_feirante(id_feirante):
    try:
        feirante = feirantes_rep.buscar_feirante_por_id(id_feirante)

        if feirante is None:
            return jsonify({"erro": f"Feirante {id_feirante} não encontrado."}), 404

        return jsonify(feirante), 200

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@feirante_bp.route('/<int:id_feirante>', methods=['DELETE'])
@jwt_required()
def deletar_feirante(id_feirante):
    try:
        feirantes_rep.deletar_feirante(id_feirante)
        return jsonify({"mensagem": f"Feirante {id_feirante} deletado com sucesso."}), 200

    except ValueError as e:
        return jsonify({"erro": str(e)}), 404

    except Exception as e:
        return jsonify({"erro": f"Erro inesperado: {str(e)}"}), 500