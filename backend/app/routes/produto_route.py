"""!
    @file produto_route.py
    @brief Este arquivo define as rotas relacionadas aos produtos na aplicação Flask.
"""

from ..models import produtos_rep, feirantes_rep
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required

produto_bp = Blueprint('produto_bp', __name__, url_prefix = '/api/produtos')

@produto_bp.route('/', methods = ['POST'])
#@jwt_required()
def criar_produto():
    """!
        @brief Cria um novo produto no sistema.

        @details Esta rota processa uma requisição POST proveniente do front
        contendo os dados necessários para criar um novo produto.

        @param[in] feirante_id ID do feirante que está cadastrando o produto.
        @param[in] nome Nome do produto.
        @param[in] preco Preço do produto.
        @param[in] descricao Descrição do produto (opcional).
        @param[in] latitude Latitude da localização do produto (opcional).
        @param[in] longitude Longitude da localização do produto (opcional).

        @pre feirante_id Deve ser um ID válido de um feirante existente.
        @pre nome Deve conter entre 5 e 50 caracteres.
        @pre preco Deve ser um valor maior que zero e conter exatamente duas casas decimais.
        @pre descricao Deve conter no máximo 500 caracteres, se fornecida.

        @post Insere um novo produto na tabela 'produtos' do banco de dados.

        @throws ValueError Se os dados fornecidos forem inválidos.
        @throws ConnectionError Se houver falha ao salvar o produto no banco.

        @return Retorna um JSON de resposta contendo os dados do produto criado
                em caso de sucesso (201) ou uma mensagem de erro em caso de falha.
    """
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
    """!
        @brief Lista todos os produtos ou filtra por feirante_id.

        @param[in] feirante_id (opcional) ID do feirante para filtrar os produtos.

        @post Recupera os produtos da tabela 'produtos' do banco de dados.

        @throws Exception Se ocorrer um erro ao listar os produtos.

        @return Retorna um JSON de resposta contendo a lista de produtos
                em caso de sucesso (200) ou uma mensagem de erro em caso de falha. 
        
    """
    feirante_id = request.args.get('feirante_id')

    try:
        produtos = produtos_rep.listar_produtos(feirante_id = feirante_id)
        return jsonify(produtos), 200

    except Exception as e:
        return jsonify({"erro": f"Erro ao listar produtos: {str(e)}"}), 500

@produto_bp.route('/<int:id_produto>', methods = ['GET'])
def listar_produto_por_id(id_produto):
    """!
        @brief Busca um produto pelo seu ID.

        @param id_produto ID do produto a ser buscado.

        @post Busca o produto na tabela 'produtos' do banco de dados.

        @throws Exception Se ocorrer um erro ao buscar o produto.

        @return Retorna um JSON de resposta contendo os dados do produto
                em caso de sucesso (200) ou uma mensagem de erro em caso de falha.
        
    """
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
    """!
        @brief Deleta um produto do sistema.

        @param id_produto ID do produto a ser deletado.

        @pre id_produto Deve existir no banco de dados.
        @post Remove o produto da tabela 'produtos' do banco de dados.

        @throws ValueError Se o produto com o ID fornecido não for encontrado.
        @throws Exception Se ocorrer um erro inesperado durante a operação.

        @return Retorna um JSON de resposta contendo uma mensagem de sucesso
                em caso de sucesso (200) ou uma mensagem de erro em caso de falha.
    """
    try:
        produtos_rep.deletar_produto(id_produto)
        return jsonify({"mensagem": f"Produto {id_produto} deletado com sucesso."}), 200

    except ValueError as e:
        return jsonify({"erro": str(e)}), 404

    except Exception as e:
        return jsonify({"erro": f"Erro inesperado: {str(e)}"}), 500
