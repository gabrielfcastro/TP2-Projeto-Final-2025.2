# -*- coding: utf-8 -*-
from flask import Blueprint, jsonify, request

mock_api = Blueprint("mock_api", __name__)

produtos_db = [
    {"id": 1, "feirante_id": 1, "nome": "Notebook Gamer", "descricao": "Roda tudo no ultra.", "preco": 4500.00},
    {"id": 2, "feirante_id": 1, "nome": "Mouse Sem Fio", "descricao": "Bateria dura muito.", "preco": 50.00},
    {"id": 3, "feirante_id": 1, "nome": "Teclado Mecânico", "descricao": "Switch Blue barulhento.", "preco": 250.00},
]

@mock_api.get("/api/produtos")
def listar_produtos():
    return jsonify(produtos_db)

@mock_api.get("/api/produtos/<int:id_produto>")
def produto_unico(id_produto):
    for p in produtos_db:
        if p["id"] == id_produto:
            return jsonify(p)
    return jsonify({"erro": "Produto não encontrado"}), 404

@mock_api.post("/api/produtos")
def criar_produto():
    dados = request.json
    novo_id = produtos_db[-1]["id"] + 1 if produtos_db else 1
    novo_produto = {
        "id": novo_id,
        "feirante_id": dados.get("feirante_id", 1),
        "nome": dados["nome"],
        "descricao": dados.get("descricao", ""),
        "preco": float(dados.get("preco", 0))
    }
    produtos_db.append(novo_produto)
    return jsonify(novo_produto), 201

@mock_api.delete("/api/produtos/<int:id_produto>")
def deletar_produto(id_produto):
    global produtos_db
    produtos_db = [p for p in produtos_db if p["id"] != id_produto]
    return jsonify({"mensagem": "Removido com sucesso"}), 200
