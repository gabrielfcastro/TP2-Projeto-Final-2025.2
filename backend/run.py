# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app) # Permite que o Next.js acesse o Python

# --- BANCO DE DADOS EM MEMÓRIA (Global) ---
# Fica fora das funções para guardar as alterações enquanto o servidor roda
produtos_db = [
    {
        "id": 1,
        "feirante_id": 1,
        "nome": "Notebook Gamer",
        "descricao": "Roda tudo no ultra.",
        "preco": 4500.00
    },
    {
        "id": 2,
        "feirante_id": 1,
        "nome": "Mouse Sem Fio",
        "descricao": "Bateria dura muito.",
        "preco": 50.00
    },
    {
        "id": 3,
        "feirante_id": 1,
        "nome": "Teclado Mecânico",
        "descricao": "Switch Blue barulhento.",
        "preco": 250.00
    }
]

# 1. LISTAR TODOS (GET)
@app.route('/api/produtos', methods=['GET'])
def get_produtos():
    return jsonify(produtos_db)

# 2. BUSCAR UM ÚNICO PRODUTO PELO ID (GET) - Necessário para a tela de Editar
@app.route('/api/produtos/<int:id_produto>', methods=['GET'])
def get_produto_unico(id_produto):
    for prod in produtos_db:
        if prod['id'] == id_produto:
            return jsonify(prod)
    return jsonify({"erro": "Produto não encontrado"}), 404

# 3. CRIAR NOVO (POST)
@app.route('/api/produtos', methods=['POST'])
def criar_produto():
    dados = request.json
    # Gera ID automático (pega o último + 1)
    novo_id = produtos_db[-1]['id'] + 1 if produtos_db else 1
    
    novo_produto = {
        "id": novo_id,
        "feirante_id": dados.get('feirante_id', 1),
        "nome": dados.get('nome'),
        "descricao": dados.get('descricao', ''),
        "preco": float(dados.get('preco', 0))
    }
    
    produtos_db.append(novo_produto)
    return jsonify(novo_produto), 201

# 4. ATUALIZAR (PUT) - Necessário para salvar a Edição
@app.route('/api/produtos/<int:id_produto>', methods=['PUT'])
def atualizar_produto(id_produto):
    dados = request.json
    for prod in produtos_db:
        if prod['id'] == id_produto:
            prod['nome'] = dados.get('nome', prod['nome'])
            prod['descricao'] = dados.get('descricao', prod['descricao'])
            prod['preco'] = float(dados.get('preco', prod['preco']))
            return jsonify(prod), 200
    return jsonify({"erro": "Produto não encontrado"}), 404

# 5. DELETAR (DELETE)
@app.route('/api/produtos/<int:id_produto>', methods=['DELETE'])
def deletar_produto(id_produto):
    global produtos_db
    # Recria a lista removendo o item do ID informado
    produtos_db = [prod for prod in produtos_db if prod['id'] != id_produto]
    return jsonify({"mensagem": "Removido com sucesso"}), 200

if __name__ == "__main__":
    app.run(debug=True, port=5000)