# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
from datetime import timedelta
import os

app = Flask(__name__)

# Configuração CORS
CORS(app, origins="http://localhost:3000")

# Configuração JWT
app.config["JWT_SECRET_KEY"] = "sua-chave-secreta-super-forte-aqui-2025"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

jwt = JWTManager(app)

# Dados em memória (para teste)
produtos = []
usuarios = [
    {"id": 1, "nome": "Admin", "email": "admin@feira.com", "senha": "123", "tipo": "admin"},
    {"id": 2, "nome": "João Feirante", "email": "joao@feira.com", "senha": "123", "tipo": "feirante"}
]

# ========== ROTAS DE AUTENTICAÇÃO ==========
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or 'email' not in data or 'senha' not in data:
        return jsonify({"error": "Email e senha são obrigatórios"}), 400
    
    # Buscar usuário
    usuario = next((u for u in usuarios if u['email'] == data['email'] and u['senha'] == data['senha']), None)
    
    if not usuario:
        return jsonify({"error": "Credenciais inválidas"}), 401
    
    # Criar token JWT
    access_token = create_access_token(
        identity=usuario['email'],
        additional_claims={
            "id": usuario['id'],
            "nome": usuario['nome'],
            "tipo": usuario['tipo']
        }
    )
    
    return jsonify({
        "message": "Login realizado com sucesso",
        "access_token": access_token,
        "usuario": {
            "id": usuario['id'],
            "nome": usuario['nome'],
            "email": usuario['email'],
            "tipo": usuario['tipo']
        }
    }), 200

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Validação básica
    required_fields = ['nome', 'email', 'senha', 'tipo']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Campo {field} é obrigatório"}), 400
    
    # Verificar se usuário já existe
    if any(u['email'] == data['email'] for u in usuarios):
        return jsonify({"error": "Usuário já cadastrado"}), 400
    
    # Criar usuário
    novo_usuario = {
        "id": len(usuarios) + 1,
        "nome": data['nome'],
        "email": data['email'],
        "senha": data['senha'],
        "tipo": data['tipo']
    }
    
    usuarios.append(novo_usuario)
    return jsonify({
        "message": "Usuário cadastrado com sucesso",
        "usuario": novo_usuario
    }), 201

# ========== ROTAS DE PRODUTOS ==========
@app.route('/api/produtos', methods=['GET'])
def listar_produtos():
    nome = request.args.get('nome')
    if nome:
        resultados = [p for p in produtos if nome.lower() in p['nome'].lower()]
        return jsonify(resultados), 200
    return jsonify(produtos), 200

@app.route('/api/produtos/<int:id>', methods=['GET'])
def buscar_produto(id):
    for produto in produtos:
        if produto['id'] == id:
            return jsonify(produto), 200
    return jsonify({"error": "Produto não encontrado"}), 404

@app.route('/api/produtos', methods=['POST'])
@jwt_required()
def criar_produto():
    data = request.get_json()
    
    required_fields = ['nome', 'preco', 'feirante_id']
    for field in required_fields:
        if field not in data:
            return jsonify({"error": f"Campo {field} é obrigatório"}), 400
    
    novo_produto = {
        "id": len(produtos) + 1,
        "nome": data['nome'],
        "preco": data['preco'],
        "feirante_id": data['feirante_id'],
        "categoria": data.get('categoria', ''),
        "descricao": data.get('descricao', ''),
        "imagem_url": data.get('imagem_url', ''),
        "localizacao": data.get('localizacao', {})
    }
    
    produtos.append(novo_produto)
    return jsonify(novo_produto), 201

@app.route('/api/produtos/<int:id>', methods=['DELETE'])
@jwt_required()
def deletar_produto(id):
    for i, produto in enumerate(produtos):
        if produto['id'] == id:
            produto_removido = produtos.pop(i)
            return jsonify({"message": "Produto removido", "produto": produto_removido}), 200
    return jsonify({"error": "Produto não encontrado"}), 404

@app.route('/api/search', methods=['GET'])
def buscar_produtos():
    nome = request.args.get('nome', '')
    if nome:
        resultados = [p for p in produtos if nome.lower() in p['nome'].lower()]
        return jsonify(resultados), 200
    return jsonify(produtos), 200

# ========== ROTAS DE ADMIN ==========
@app.route('/api/admin/dashboard', methods=['GET'])
@jwt_required()
def dashboard():
    # Dados mockados para exemplo
    return jsonify({
        "total_usuarios": len(usuarios),
        "total_produtos": len(produtos),
        "total_feirantes": len([u for u in usuarios if u['tipo'] == 'feirante']),
        "usuarios_ativos": len(usuarios) - 1,
        "pesquisas_realizadas": 1234,
        "produtos_populares": [
            {"nome": "Tomate", "vendas": 45},
            {"nome": "Alface", "vendas": 38},
            {"nome": "Cenoura", "vendas": 32}
        ]
    }), 200

# ========== ROTA DE HEALTH CHECK ==========
@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "status": "online",
        "message": "iFeiranet Backend API",
        "endpoints": [
            "POST /api/login",
            "POST /api/register",
            "GET  /api/produtos",
            "GET  /api/produtos/<id>",
            "POST /api/produtos",
            "DELETE /api/produtos/<id>",
            "GET  /api/search?nome=...",
            "GET  /api/admin/dashboard",
            "GET  /api/health"
        ]
    }), 200

@app.route('/')
def index():
    return jsonify({
        "message": "Bem-vindo à API do iFeiranet",
        "version": "1.0.0",
        "docs": "/api/health"
    }), 200

if __name__ == "__main__":
    print("=" * 50)
    print("🚀 iFeiranet Backend API - Versão Simplificada")
    print("=" * 50)
    print("📡 Endpoints disponíveis:")
    print("  POST /api/login             - Login")
    print("  POST /api/register          - Cadastro")
    print("  GET  /api/produtos          - Listar produtos")
    print("  GET  /api/produtos/<id>     - Buscar produto por ID")
    print("  POST /api/produtos          - Criar produto (JWT)")
    print("  DELETE /api/produtos/<id>   - Deletar produto (JWT)")
    print("  GET  /api/search?nome=...   - Buscar produtos")
    print("  GET  /api/admin/dashboard   - Dashboard admin (JWT)")
    print("  GET  /api/health            - Status da API")
    print("=" * 50)
    print("🔌 Servidor rodando em: http://localhost:5000")
    print("🔗 Frontend deve usar: http://localhost:5000/api/...")
    print("=" * 50)
    
    app.run(debug=True, port=5000)