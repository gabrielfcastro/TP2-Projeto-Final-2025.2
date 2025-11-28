from flask import Flask
from flask_cors import CORS
from mock.mock_produtos import mock_api
from mock.mock_feirantes import mock_feirantes

def create_app():
    app = Flask(__name__)
    CORS(app)

    # Importa e registra blueprints
    from app.routes.feirantes_routes import bp_feirantes
    app.register_blueprint(bp_feirantes, url_prefix="/api/feirantes")
    app.register_blueprint(mock_api)
    app.register_blueprint(mock_feirantes)

    return app
