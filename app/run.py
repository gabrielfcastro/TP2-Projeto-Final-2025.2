"""
    Este módulo inicializa a aplicação Flask.
"""

from flask import Flask

def create_app():
    """
        Função para criar e configurar a aplicação Flask.
    """
    app = Flask(__name__)
    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
