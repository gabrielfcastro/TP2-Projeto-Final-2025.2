# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
from dotenv import load_dotenv
import os

# Carregar variáveis de ambiente
dir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(dir, ".env"))

# Importar blueprints
from app.routes.usuario_routes import usuario_bp
from app.routes.feirante_routes import feirante_bp
from app.routes.produto_route import produto_bp

def create_app():
    app = Flask(__name__)
    
    # Configuração CORS
    CORS(app, resources={r"/*": {"origins": "*"}})
    
    # Configuração JWT
    app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_KEY', "sua-chave-secreta-super-forte-aqui-2025")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    
    jwt = JWTManager(app)
    
    # Dados em memória para autenticação (compatibilidade com sua tela de login)
    usuarios_memoria = [
        {"id": 1, "nome": "Admin", "email": "admin@feira.com", "senha": "123", "tipo": "admin"},
        {"id": 2, "nome": "João Feirante", "email": "joao@feira.com", "senha": "123", "tipo": "feirante"},
        {"id": 3, "nome": "Usuário Teste", "email": "user@feira.com", "senha": "123", "tipo": "user"}
    ]
    
    produtos_memoria = []
    
    # ========== ROTAS DE AUTENTICAÇÃO (para compatibilidade com seu frontend) ==========
    
    @app.route('/api/login', methods=['POST'])
    def login():
        """Rota de login para compatibilidade com sua tela de login"""
        data = request.get_json()
        
        if not data or 'email' not in data or 'senha' not in data:
            return jsonify({"error": "Email e senha são obrigatórios"}), 400
        
        # Buscar usuário nos dados em memória
        usuario = next((u for u in usuarios_memoria if u['email'] == data['email'] and u['senha'] == data['senha']), None)
        
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
        """Rota de registro para compatibilidade com sua tela de login"""
        data = request.get_json()
        
        # Validação básica
        required_fields = ['nome', 'email', 'senha', 'tipo']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Campo {field} é obrigatório"}), 400
        
        # Verificar se usuário já existe
        if any(u['email'] == data['email'] for u in usuarios_memoria):
            return jsonify({"error": "Usuário já cadastrado"}), 400
        
        # Criar usuário
        novo_usuario = {
            "id": len(usuarios_memoria) + 1,
            "nome": data['nome'],
            "email": data['email'],
            "senha": data['senha'],
            "tipo": data['tipo']
        }
        
        usuarios_memoria.append(novo_usuario)
        
        # Criar token JWT para o novo usuário
        access_token = create_access_token(
            identity=novo_usuario['email'],
            additional_claims={
                "id": novo_usuario['id'],
                "nome": novo_usuario['nome'],
                "tipo": novo_usuario['tipo']
            }
        )
        
        return jsonify({
            "message": "Usuário cadastrado com sucesso",
            "access_token": access_token,
            "usuario": novo_usuario
        }), 201
    
    @app.route('/api/health', methods=['GET'])
    def health():
        """Rota de health check"""
        return jsonify({
            "status": "online",
            "message": "iFeiranet Backend API",
            "version": "1.1.0",
            "endpoints": [
                "POST /api/login",
                "POST /api/register",
                "GET  /api/health"
            ]
        }), 200
    
    @app.route('/api/admin/dashboard', methods=['GET'])
    @jwt_required()
    def dashboard():
        """Dashboard admin (mockado para compatibilidade)"""
        # Dados mockados para exemplo
        return jsonify({
            "total_usuarios": len(usuarios_memoria),
            "total_produtos": len(produtos_memoria),
            "total_feirantes": len([u for u in usuarios_memoria if u['tipo'] == 'feirante']),
            "usuarios_ativos": len(usuarios_memoria) - 1,
            "pesquisas_realizadas": 1234,
            "produtos_populares": [
                {"nome": "Tomate", "vendas": 45},
                {"nome": "Alface", "vendas": 38},
                {"nome": "Cenoura", "vendas": 32}
            ]
        }), 200
    
    # ========== ROTAS DE PRODUTOS EM MEMÓRIA (backup/compatibilidade) ==========
    
    @app.route('/api/produtos', methods=['GET'])
    def listar_produtos():
        """Listar produtos da memória (compatibilidade)"""
        nome = request.args.get('nome')
        if nome:
            resultados = [p for p in produtos_memoria if nome.lower() in p['nome'].lower()]
            return jsonify(resultados), 200
        return jsonify(produtos_memoria), 200
    
    @app.route('/api/produtos/<int:id>', methods=['GET'])
    def buscar_produto(id):
        """Buscar produto por ID da memória (compatibilidade)"""
        for produto in produtos_memoria:
            if produto['id'] == id:
                return jsonify(produto), 200
        return jsonify({"error": "Produto não encontrado"}), 404
    
    @app.route('/api/produtos', methods=['POST'])
    @jwt_required()
    def criar_produto():
        """Criar produto na memória (compatibilidade)"""
        data = request.get_json()
        
        required_fields = ['nome', 'preco', 'feirante_id']
        for field in required_fields:
            if field not in data:
                return jsonify({"error": f"Campo {field} é obrigatório"}), 400
        
        novo_produto = {
            "id": len(produtos_memoria) + 1,
            "nome": data['nome'],
            "preco": data['preco'],
            "feirante_id": data['feirante_id'],
            "categoria": data.get('categoria', ''),
            "descricao": data.get('descricao', ''),
            "imagem_url": data.get('imagem_url', ''),
            "localizacao": data.get('localizacao', {})
        }
        
        produtos_memoria.append(novo_produto)
        return jsonify(novo_produto), 201
    
    @app.route('/api/search', methods=['GET'])
    def buscar_produtos():
        """Buscar produtos por nome (compatibilidade)"""
        nome = request.args.get('nome', '')
        if nome:
            resultados = [p for p in produtos_memoria if nome.lower() in p['nome'].lower()]
            return jsonify(resultados), 200
        return jsonify(produtos_memoria), 200
    
    # ========== REGISTRAR BLUEPRINTS (estrutura modular da main) ==========
    
    app.register_blueprint(usuario_bp)
    app.register_blueprint(feirante_bp)
    app.register_blueprint(produto_bp)
    
    # ========== ROTA INICIAL ==========
    
    @app.route('/')
    def index():
        return jsonify({
            "message": "Bem-vindo à API do iFeiranet",
            "version": "1.1.0",
            "endpoints_compatibilidade": [
                "POST /api/login - Login (compatível com seu frontend)",
                "POST /api/register - Registro (compatível com seu frontend)",
                "GET  /api/health - Status da API"
            ],
            "blueprints_ativos": [
                "usuario_bp - Rotas de usuário (modular)",
                "feirante_bp - Rotas de feirante (modular)",
                "produto_bp - Rotas de produto (modular)"
            ]
        }), 200
    
    return app

if __name__ == "__main__":
    app = create_app()
    
    print("=" * 60)
    print("iFeiranet Backend API - Versão Híbrida")
    print("=" * 60)
    print("Endpoints de compatibilidade (para seu frontend):")
    print("  POST /api/login             - Login")
    print("  POST /api/register          - Cadastro")
    print("  GET  /api/health            - Status da API")
    print("  GET  /api/admin/dashboard   - Dashboard admin (JWT)")
    print("  GET  /api/produtos          - Listar produtos")
    print("  GET  /api/produtos/<id>     - Buscar produto por ID")
    print("  POST /api/produtos          - Criar produto (JWT)")
    print("  GET  /api/search?nome=...   - Buscar produtos")
    print("=" * 60)
    print(" Servidor rodando em: http://localhost:5000")
    print(" Frontend deve usar: http://localhost:5000/api/...")
    print("=" * 60)
    
    app.run(debug=True, port=5000)