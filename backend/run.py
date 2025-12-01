'''''

"""
    Este módulo inicializa a aplicação Flask.
"""

from flask import Flask, jsonify
from flask_cors import CORS # Importante para conectar com o Next.js

def create_app():
    """
        Função para criar e configurar a aplicação Flask.
    """
    app = Flask(__name__)
    
    # (permite que o Next.js acesse)
    CORS(app) 

    # --- ROTA DE TESTE (substituir pelo banco de dados depois) ---
    @app.route('/api/produtos', methods=['GET'])
    def get_produtos():
        mock_produtos = [
            {"id": 1, "nome": "Notebook Gamer", "preco": 4500.00},
            {"id": 2, "nome": "Mouse Sem Fio", "preco": 50.00},
            {"id": 3, "nome": "Teclado Mecânico", "preco": 250.00}
        ]
        return jsonify(mock_produtos)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000) # Garante que rode na porta 5000
    
'''''
"""
Este módulo inicializa a aplicação Flask.
"""

from flask import Flask, jsonify, request
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    CORS(app)  # Permite que o Next.js acesse

    # --- BANCO DE DADOS MOCK (substituir por banco real depois) ---
    users_db = [
        {
            "id": 1,
            "email": "usuario@teste.com",
            "password": "senha123",  # Em produção, isso deve ser hash
            "nome": "João Silva",
            "user_type": "user",
            "nome_banca": "",
            "localizacao": ""
        },
        {
            "id": 2,
            "email": "feirante@teste.com", 
            "password": "senha123",
            "nome": "Maria Santos",
            "user_type": "vendor",
            "nome_banca": "Frutas Frescas",
            "localizacao": "Setor de Feiras Norte"
        }
    ]

    # --- ROTAS DE AUTENTICAÇÃO ---

    # ROTA 1: Login de usuário
    @app.route('/api/login', methods=['POST'])
    def login():
        data = request.get_json()
        
        email = data.get('email')
        password = data.get('password')
        
        # Buscar usuário no "banco de dados"
        user = next((u for u in users_db if u['email'] == email and u['password'] == password), None)
        
        if user:
            # Remover a senha da resposta por segurança
            user_response = user.copy()
            user_response.pop('password')
            return jsonify({
                "success": True,
                "message": "Login realizado com sucesso!",
                "user": user_response
            }), 200
        else:
            return jsonify({
                "success": False,
                "message": "Email ou senha incorretos"
            }), 401

    # ROTA 2: Cadastro de novo usuário
    @app.route('/api/register', methods=['POST'])
    def register():
        data = request.get_json()
        
        # Verificar se email já existe
        existing_user = next((u for u in users_db if u['email'] == data.get('email')), None)
        if existing_user:
            return jsonify({
                "success": False,
                "message": "Email já cadastrado"
            }), 400
        
        # Criar novo usuário
        new_user = {
            "id": len(users_db) + 1,
            "email": data.get('email'),
            "password": data.get('password'),  # Em produção, fazer hash
            "nome": data.get('nome'),
            "user_type": data.get('user_type', 'user'),
            "nome_banca": data.get('nome_banca', ''),
            "localizacao": data.get('localizacao', '')
        }
        
        users_db.append(new_user)
        
        # Remover senha da resposta
        user_response = new_user.copy()
        user_response.pop('password')
        
        return jsonify({
            "success": True,
            "message": "Cadastro realizado com sucesso!",
            "user": user_response
        }), 201

    # ROTA 3: Verificar se email está disponível
    @app.route('/api/check-email', methods=['POST'])
    def check_email():
        data = request.get_json()
        email = data.get('email')
        
        existing_user = next((u for u in users_db if u['email'] == email), None)
        
        return jsonify({
            "available": not existing_user
        }), 200

    # ROTA 4: Logout (para manter consistência)
    @app.route('/api/logout', methods=['POST'])
    def logout():
        return jsonify({
            "success": True,
            "message": "Logout realizado com sucesso!"
        }), 200

    # --- ROTA DE TESTE (já existente) ---
    @app.route('/api/produtos', methods=['GET'])
    def get_produtos():
        mock_produtos = [
            {"id": 1, "nome": "Notebook Gamer", "preco": 4500.00},
            {"id": 2, "nome": "Mouse Sem Fio", "preco": 50.00},
            {"id": 3, "nome": "Teclado Mecânico", "preco": 250.00}
        ]
        return jsonify(mock_produtos)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)