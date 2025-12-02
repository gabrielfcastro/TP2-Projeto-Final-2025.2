from ..models import historico_busca_rep
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

historico_busca_bp = Blueprint('historico_busca_bp', __name__, url_prefix='/api/historico_busca')

@historico_busca_bp.route('/', methods=['POST'])
@jwt_required()
def criar_historico():
    dados = request.json

    if not dados:
        return jsonify({'erro': 'JSON ausente'}), 400
    
    produto_buscado = dados.get('produto_buscado')
    feirante_buscado = dados.get('feirante_buscado')

    if not produto_buscado and not feirante_buscado:
        return jsonify({'erro': 'Digite um produto ou feirante para buscar'}), 400
    
    try:
        current_user_id = get_jwt_identity()
        
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
@jwt_required()
def listar_historico():
    try:
        current_user_id = get_jwt_identity()
        
        limit = request.args.get('limit', default=None, type=int)
        
        if limit:
            historicos = historico_busca_rep.buscar_historico_recente(
                user_id=current_user_id, 
                limite=limit
            )
        else:
            historicos = historico_busca_rep.listar_historico_busca(
                user_id=current_user_id
            )
        
        return jsonify({
            'usuario_id': current_user_id,
            'total_buscas': len(historicos),
            'historicos': historicos
        }), 200
    
    except Exception as e:
        return jsonify({"erro": "Erro interno no servidor"}), 500

@historico_busca_bp.route('/', methods=['DELETE'])
@jwt_required()
def limpar_historico():
    try:
        current_user_id = get_jwt_identity()
        
        registros_deletados = historico_busca_rep.deletar_historico_por_usuario(
            user_id=current_user_id
        )
        
        return jsonify({
            'mensagem': f'Histórico limpo com sucesso',
            'registros_removidos': registros_deletados
        }), 200
    
    except Exception as e:
        return jsonify({"erro": "Erro interno no servidor"}), 500