from flask import Blueprint, request, jsonify
from app.services.feirantes_services import feirantesService

bp_feirantes = Blueprint("feirantes", __name__)

@bp_feirantes.post("/")
def criar_feirante():
    try:
        dados = request.json
        novo_id = feirantesService.criar(dados)
        return jsonify({"id" : novo_id}), 201
    except Exception as e:
        return jsonify({"erro": str(e)}), 400
    
@bp_feirantes.get("/")
def listar_feirantes():
    return jsonify(feirantesService.listar()), 200

@bp_feirantes.get("/")
def detalhar_feirante(id):
    try:
        f = feirantesService.detalhar(id)
        return jsonify(f), 200
    except Exception as e:
        return jsonify({"Error": str(e)}), 404

@bp_feirantes.put("/<int:id>")
def atualizar_feirantes(id):
    try:
        dados = request.json
        feirantesService.atualizar(id, dados)
        return jsonify({"msg": "Atualizado"}), 200
    except Exception as e:
        return jsonify({"erro":str(e)}), 400
    

