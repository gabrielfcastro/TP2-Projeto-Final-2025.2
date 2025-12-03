# testar_api.py
import requests
import json

# Testar registro
print("=== TESTANDO REGISTRO ===")
url_registro = "http://localhost:5000/api/usuarios/"
dados_registro = {
    "email": "teste@email.com",
    "nome": "Teste Usuario",
    "senha": "Senha123!"
}

try:
    response = requests.post(url_registro, json=dados_registro)
    print(f"Status: {response.status_code}")
    print(f"Resposta: {response.text}")
except Exception as e:
    print(f"Erro: {e}")

print("\n=== TESTANDO LOGIN ===")
# Testar login
url_login = "http://localhost:5000/api/usuarios/login"
dados_login = {
    "email": "teste@email.com",
    "senha": "Senha123!"
}

try:
    response = requests.post(url_login, json=dados_login)
    print(f"Status: {response.status_code}")
    print(f"Resposta: {response.text}")
except Exception as e:
    print(f"Erro: {e}")