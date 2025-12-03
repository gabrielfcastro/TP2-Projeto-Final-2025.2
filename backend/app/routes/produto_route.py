from ..models import produtos_rep, feirantes_rep
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

produto_bp = Blueprint('produto_bp', __name__, url_prefix = '/api/produtos')

@produto_bp.route('/', methods = ['POST'])
#@jwt_required()
def criar_produto():
    dados = request.json

    if not dados:
        return jsonify({'erro': 'JSON ausente'}), 400

    feirante_id = dados.get('feirante_id')
    nome = dados.get('nome')
    preco = dados.get('preco')
    descricao = dados.get('descricao')
    latitude = dados.get('latitude')
    longitude = dados.get('longitude')

    if not all([feirante_id, nome, preco]):
        return jsonify({'erro': 'feirante_id, nome e preco são obrigatórios.'}), 400

    try:

        id_produto = produtos_rep.adicionar_produto(
            feirante_id = feirante_id,
            nome = nome,
            descricao = descricao,
            preco = preco,
            latitude = dados.get('latitude'),
            longitude = dados.get('longitude')
        )

        if not id_produto:
            raise ConnectionError("Erro ao salvar o produto no banco de dados.")

        produto_criado = produtos_rep.buscar_produto_por_id(id_produto)
        return jsonify(produto_criado), 201

    except ValueError as e:
        return jsonify({"erro": str(e)}), 400

    except Exception as e:
        return jsonify({"erro": f"Erro inesperado: {str(e)}"}), 500

@produto_bp.route('/', methods=['GET'])
def listar_produtos():
    feirante_id = request.args.get('feirante_id')

    try:
        produtos = produtos_rep.listar_produtos(feirante_id = feirante_id)
        return jsonify(produtos), 200

    except Exception as e:
        return jsonify({"erro": f"Erro ao listar produtos: {str(e)}"}), 500

@produto_bp.route('/<int:id_produto>', methods = ['GET'])
def listar_produto_por_id(id_produto):
    try:
        produto = produtos_rep.buscar_produto_por_id(id_produto)

        if not produto:
            return jsonify({"erro": "Produto não encontrado"}), 404

        return jsonify(produto), 200

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@produto_bp.route('/<int:id_produto>', methods = ['DELETE'])
#@jwt_required()
def deletar_produto(id_produto):
    try:
        produtos_rep.deletar_produto(id_produto)
        return jsonify({"mensagem": f"Produto {id_produto} deletado com sucesso."}), 200

    except ValueError as e:
        return jsonify({"erro": str(e)}), 404

    except Exception as e:
        return jsonify({"erro": f"Erro inesperado: {str(e)}"}), 500
