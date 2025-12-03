from sqlalchemy import create_engine, MetaData
import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.abspath(os.path.join(BASE_DIR, "../../banco.db"))

engine = create_engine(f"sqlite:///{db_path}",pool_pre_ping = True, echo = False,
                       connect_args={"timeout": 15})

metadata = MetaData()
metadata.reflect(bind = engine)

try:
    with engine.connect() as conn:
        print("Conexão bem-sucedida ao banco!")
except Exception as e:
    print("Erro ao conectar:", e)