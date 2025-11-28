from flask import Blueprint, jsonify, request

mock_feirantes = Blueprint("mock_feirantes", __name__)

# Banco em memória (mock)
feirantes_db = [
    {
        "id": 1,
        "nome": "Carlos da Feira",
        "categoria": "Eletrônicos",
        "telefone": "11 99999-9999",
        "descricao": "Vende eletrônicos usados e revisados."
    },
    {
        "id": 2,
        "nome": "Maria Verduras",
        "categoria": "Hortifruti",
        "telefone": "11 88888-8888",
        "descricao": "Produtora local de verduras orgânicas."
    }
]

# LISTAR TODOS FEIRANTES
@mock_feirantes.get("/api/feirantes")
def listar_feirantes():
    return jsonify(feirantes_db)

# BUSCAR UM FEIRANTE
@mock_feirantes.get("/api/feirantes/<int:id_feirante>")
def get_feirante(id_feirante):
    for f in feirantes_db:
        if f["id"] == id_feirante:
            return jsonify(f)
    return jsonify({"erro": "Feirante não encontrado"}), 404

# CRIAR FEIRANTE
@mock_feirantes.post("/api/feirantes")
def criar_feirante():
    dados = request.json
    novo_id = feirantes_db[-1]["id"] + 1 if feirantes_db else 1

    novo_feirante = {
        "id": novo_id,
        "nome": dados.get("nome"),
        "categoria": dados.get("categoria", ""),
        "telefone": dados.get("telefone", ""),
        "descricao": dados.get("descricao", "")
    }

    feirantes_db.append(novo_feirante)
    return jsonify(novo_feirante), 201

# DELETAR FEIRANTE
@mock_feirantes.delete("/api/feirantes/<int:id_feirante>")
def deletar_feirante(id_feirante):
    global feirantes_db
    feirantes_db = [f for f in feirantes_db if f["id"] != id_feirante]
    return jsonify({"mensagem": "Feirante removido"}), 200
