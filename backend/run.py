# -*- coding: utf-8 -*-
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta
from dotenv import load_dotenv
import os

from app.models.usuario_rep import listar_usuarios

from app.routes.usuario_routes import usuario_bp
from app.routes.feirante_routes import feirante_bp
from app.routes.produto_route import produto_bp
from app.routes.historico_busca_routes import historico_busca_bp

dir = os.path.abspath(os.path.dirname(__file__))
load_dotenv(os.path.join(dir, ".env"))


def create_app():
    app = Flask(__name__)

    CORS(app, resources={r"/*": {"origins": "*"}})
    app.config["JWT_SECRET_KEY"] = os.environ.get('JWT_KEY')
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)

    jwt = JWTManager(app)

    @jwt.user_lookup_loader
    def user_lookup_callback(jwt_header, jwt_data):
        email = jwt_data["sub"]
        usuario = listar_usuarios(email= email)

        if not usuario:
            return None
        return usuario[0]

    app.register_blueprint(usuario_bp)
    app.register_blueprint(feirante_bp)
    app.register_blueprint(produto_bp)
    app.register_blueprint(historico_busca_bp)

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, port=5000)

app = create_app()
print("Registered blueprints:", app.blueprints.keys())