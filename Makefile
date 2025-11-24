PYTHON = python3
PIP = pip
PYTEST = pytest
PYLINT = pylint
DOXYGEN = doxygen

APP_DIR = app
TEST_DIR = tests
DATABASE_DIR = database

PYLINTFILE ?= $(APP_DIR)
TESTFILE ?= $(TEST_DIR) 

all: install init_db pylint test

install:
	@echo "Instalando Dependências..."
	$(PIP) install -r requirements.txt
	@echo "Dependências Instaladas."

init_db:
	@echo "Inicializando Banco de Dados..."
	$(PYTHON) $(DATABASE_DIR)/create_database.py
	@echo "Banco de Dados Inicializado."
 
pylint:
	@echo "Verificador de Código..."
	$(PYTHON) -m pylint $(PYLINTFILE)
	@echo "Verificação Concluída."

test:
	@echo "Executando Testes..."
	COVERAGE_FILE=$(TEST_DIR)/.coverage PYTHONPATH=. $(PYTHON) -m pytest -v --cov=$(APP_DIR) $(TESTFILE)
	@echo "Testes Concluídos."

run:
	$(PYTHON) $(APP_DIR)/run.py

docs:
	$(DOXYGEN) Doxyfile

clean:
	find . -type d -name "__pycache__" -exec $(RM) {} +
	find . -type f -name "*.pyc" -delete
	$(RM) .pytest_cache
	$(RM) $(TEST_DIR)/.coverage
