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