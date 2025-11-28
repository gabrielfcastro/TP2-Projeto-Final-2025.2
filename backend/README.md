## Como executar:

1. Clone o repositório
2. Entre no .env : 
- Windows : `.env\Scripts\activate`
- Linux : `source .env/bin/activate`
3. Instalar as Dependências : `make install`
4. Iniciar o database : `make init_db`
5. Executar o servidor : `make run`

### Testes e Verificador Estático
- Executar o pylint : `make pylint PYLINTFILE=path_do_arquivo`
- Executar o pytest-cov : `make test TESTFILE=path_do_arquivo`