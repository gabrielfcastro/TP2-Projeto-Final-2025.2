"""!
    @file feirante_routes.py
    @brief Este arquivo define as rotas relacionadas aos feirantes na aplicação Flask.
"""


from flask_jwt_extended import jwt_required, get_jwt_identity
from ..models import feirantes_rep, usuario_rep
from flask import Blueprint, request, jsonify

feirante_bp = Blueprint('feirante_bp', __name__, url_prefix='/api/feirantes')

@feirante_bp.route('/', methods=['POST'])
@jwt_required()
def criar_feirante():
    """!
        @brief Cria um novo feirante no sistema.

        @details Esta rota processa uma requisição POST proveniente do front
        contendo os dados necessários para criar um novo feirante. O usuário
        deve estar autenticado para realizar esta operação.

        @param[in] nome_estabelecimento Nome do estabelecimento do feirante.
        @param[in] link_wpp Link do WhatsApp do feirante.

        @pre nome_estabelecimento Deve ser uma string não vazia.
        @pre link_wpp Deve ser uma string não vazia.

        @post Insere um novo feirante na tabela 'feirantes' do banco de dados.

        @throws ValueError Se os dados fornecidos forem inválidos.
        @throws LookupError Se o usuário autenticado não for encontrado no banco.
        @throws ConnectionError Se houver falha ao salvar o feirante no banco.

        @return Retorna um JSON de resposta contendo os dados do feirante criado
                em caso de sucesso (201) ou uma mensagem de erro em caso de falha.
    """
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
    """!
        @brief Lista todos os feirantes cadastrados no sistema.

        @details Esta rota processa uma requisição GET para recuperar a lista
        de todos os feirantes cadastrados no banco de dados.

        @post Busca todos os feirantes na tabela 'feirantes' do banco de dados.

        @throws Exception Para erros internos do servidor durante a operação.

        @return Retorna um JSON de resposta contendo:
                - Em caso de sucesso (200): Lista de dicionários com os dados dos feirantes.
                - Em caso de erro (500): {"erro": "Erro interno no servidor"} 
        
    """
    try:
        feirantes = feirantes_rep.listar_feirantes()
        return jsonify(feirantes), 200

    except Exception as e:
        return jsonify({"erro": str(e)}), 500

@feirante_bp.route('/<int:id_feirante>', methods=['GET'])
def buscar_feirante(id_feirante):
    """!
        @brief Busca um feirante pelo seu ID.

        @details Esta rota processa uma requisição GET para recuperar os dados
        de um feirante específico com base no ID fornecido na URL.

        @param[in] id_feirante ID do feirante a ser buscado.

        @post Busca o feirante na tabela 'feirantes' do banco de dados.

        @throws Exception Para erros internos do servidor durante a operação.

        @return Retorna um JSON de resposta contendo:
                - Em caso de sucesso (200): Dicionário com os dados do feirante.
                - Em caso de erro (404): {"erro": "Feirante <id> não encontrado."}
                - Em caso de erro (500): {"erro": "Erro interno no servidor"} 
    """
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
    """!
        @brief Deleta um feirante do sistema.

        @details Esta rota processa uma requisição DELETE para remover um feirante
        específico do banco de dados com base no ID fornecido na URL. O usuário
        deve estar autenticado para realizar esta operação.

        @param[in] id_feirante ID do feirante a ser deletado.

        @pre id_feirante Deve existir no banco de dados.

        @post Remove o feirante da tabela 'feirantes' do banco de dados.

        @throws ValueError Se o feirante com o ID fornecido não for encontrado.
        @throws Exception Para erros internos do servidor durante a operação.

        @return Retorna um JSON de resposta contendo:
                - Em caso de sucesso (200): {"mensagem": "Feirante <id> deletado com sucesso."}
                - Em caso de erro (404): {"erro": "Feirante <id> não encontrado."}
                - Em caso de erro (500): {"erro": "Erro interno no servidor"} 
    """
    try:
        feirantes_rep.deletar_feirante(id_feirante)
        return jsonify({"mensagem": f"Feirante {id_feirante} deletado com sucesso."}), 200

    except ValueError as e:
        return jsonify({"erro": str(e)}), 404

    except Exception as e:
        return jsonify({"erro": f"Erro inesperado: {str(e)}"}), 500