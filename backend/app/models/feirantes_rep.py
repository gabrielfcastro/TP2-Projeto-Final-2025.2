from .connection import engine, metadata

feirantesTable = metadata.tables.get("feirantes")

class feirantesRepository:

    @staticmethod
    def criar(dados):
        query = feirantesTable.insert().values(
            usuario_id=dados["usuario_id"],
            nome_estabelecimento=dados["nome_estabelecimento"],
            link=dados["link_wpp"]
        )

        with engine.connect() as conn:
            result = conn.execute(query)
            conn.commit()
            return result.inserted_primary_key[0]
        
    @staticmethod
    def listar():
        query = feirantesTable.select()

        with engine.connect() as conn:
            result = conn.execute(query)
            return [dict(row._mapping) for row in result]
        
    @staticmethod
    def buscarPorId(id):
        query = feirantesTable.select().where(feirantesTable.c.id == id)

        with engine.connect() as conn:
            result = conn.execute(query).fetchone()
            return dict(result._mapping) if result else None
    
    @staticmethod
    def atualizar(id, dados):
        query = (
            feirantesTable.update().where(feirantesTable.c.id == id).values(
                nome_estabelecimento=dados["nome_estabelecimento"],
                link=dados["link_wpp"]
            )
        )

        with engine.connect() as conn:
            result = conn.execute(query)
            conn.commit()
            return result.rowcount
        