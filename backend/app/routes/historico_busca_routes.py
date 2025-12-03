"""!
    @file historico_busca_routes.py
    @brief Este arquivo é responsável pelas rotas do Histórico de Busca.
"""

from ..models import historico_busca_rep
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

historico_busca_bp = Blueprint('historico_busca_bp', __name__, url_prefix='/api/historico_busca')

@historico_busca_bp.route('/', methods=['POST'])
def criar_historico():
    """!
        @brief Cria uma nova entrada no histórico de busca do usuário.
        
        @details Esta rota processa uma requisição POST proveniente do front
        contendo os dados de busca do usuário e os salva no histórico. 
        O usuário deve fornecer pelo menos um parâmetro de busca sendo estes 
        produto ou feirante para que a operação seja bem-sucedida.
        
        @param[in] usuario_id ID do usuário que está realizando a busca.
        @param[in] produto_buscado Nome do produto buscado (opcional).
        @param[in] feirante_buscado Nome do feirante buscado (opcional).
        
        @throws ValueError Se os dados do usuário estiverem inválidos ou se nenhum
                           parâmetro de busca for fornecido.
        @throws Exception Para erros internos do servidor durante a operação.
        
        @return Retorna um JSON de resposta contendo:
                - Em caso de sucesso (201): 
                  {
                    "mensagem": "Busca salva no histórico",
                    "historico_id": <ID da entrada criada>
                  }
                - Em caso de erro (400): {"erro": <mensagem de validação>}
                - Em caso de erro (500): {"erro": "Erro interno no servidor"}
    """

    dados = request.json

    if not dados:
        return jsonify({'erro': 'JSON ausente'}), 400
    
    current_user_id = dados.get('usuario_id')
    produto_buscado = dados.get('produto_buscado')
    feirante_buscado = dados.get('feirante_buscado')

    if not produto_buscado and not feirante_buscado:
        return jsonify({'erro': 'Digite um produto ou feirante para buscar'}), 400
    
    try:
        
        historico_id = historico_busca_rep.adicionar_historico_busca(
            usuario_id=current_user_id,
            produto_buscado=produto_buscado,
            feirante_buscado=feirante_buscado
        )

        if not historico_id:
            return jsonify({'erro': 'Falha ao salvar a busca'}), 500
        
        return jsonify({
            'mensagem': 'Busca salva no histórico',
            'historico_id': historico_id
        }), 201
        
    except ValueError as e:
        return jsonify({"erro": str(e)}), 400
    except Exception as e:
        return jsonify({"erro": "Erro interno no servidor"}), 500

@historico_busca_bp.route('/', methods=['GET'])
def listar_historico():

    """!
        @brief Lista o histórico de buscas do usuário.
        
        @details Esta rota processa uma requisição GET para recuperar o histórico
        de buscas de um usuário específico. O histórico é ordenado por ID em ordem
        decrescente (mais recentes primeiro).
        
        @param[in] usuario_id ID do usuário cujo histórico será listado.
        @param[in] limit Número máximo de registros a retornar.
        
        @throws Exception Para erros internos do servidor durante a operação.
        
        @return Retorna um JSON de resposta contendo:
                - Em caso de sucesso (200): 
                  {
                    "usuario_id": <ID do usuário>,
                    "total_buscas": <número total de buscas>,
                    "historicos": [lista de objetos de histórico]
                  }
                - Em caso de erro (400): {"erro": "ID do usuário é obrigatório"}
                - Em caso de erro (500): {"erro": "Erro interno no servidor"}
    """

    try:
        current_user_id = request.args.get('usuario_id', type=int)
        
        if not current_user_id:
            return jsonify({'erro': 'ID do usuário é obrigatório'}), 400
        
        limit = request.args.get('limit', default=None, type=int)
        
        historicos = historico_busca_rep.listar_historico_buscas(usuario_id=current_user_id)
        
        return jsonify({
            'usuario_id': current_user_id,
            'total_buscas': len(historicos),
            'historicos': historicos
        }), 200
    
    except Exception as e:
        print(f"Error in listar_historico: {e}")
        return jsonify({"erro": "Erro interno no servidor"}), 500

@historico_busca_bp.route('/', methods=['DELETE'])
def limpar_historico():
    """!
        @brief Remove todo o histórico de buscas de um usuário.
        
        @details Esta rota processa uma requisição DELETE para remover todas as
        entradas do histórico de buscas de um usuário específico.
        
        @param[in] usuario_id ID do usuário cujo histórico será removido.
        
        @throws Exception Para erros internos do servidor durante a operação.
        
        @return Retorna um JSON de resposta contendo:
                - Em caso de sucesso (200): 
                  {
                    "mensagem": "Histórico limpo com sucesso",
                    "registros_removidos": <número de registros removidos>
                  }
                - Em caso de erro (400): {"erro": "JSON ausente"} ou {"erro": "ID do usuário é obrigatório"}
                - Em caso de erro (500): {"erro": "Erro interno no servidor"}
    """

    try:
        dados = request.json
        if not dados:
            return jsonify({'erro': 'JSON ausente'}), 400
        
        current_user_id = dados.get('usuario_id')
        
        if not current_user_id:
            return jsonify({'erro': 'ID do usuário é obrigatório'}), 400
        
        registros_deletados = historico_busca_rep.deletar_historico_por_usuario(
            usuario_id=current_user_id
        )
        
        return jsonify({
            'mensagem': f'Histórico limpo com sucesso',
            'registros_removidos': registros_deletados
        }), 200
    
    except Exception as e:
        # Add error logging for debugging
        print(f"Error in limpar_historico: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"erro": "Erro interno no servidor"}), 500