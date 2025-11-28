from app.models.feirantes_rep import feirantesRepository

class feirantesService:

    @staticmethod
    def criar(dados):
        if not dados.get("usuario_id"):
            raise ValueError("usuario_id é obrigatorio")

        return feirantesRepository.criar(dados)
    
    @staticmethod
    def listar():
        return feirantesRepository.listar()

    @staticmethod
    def detalhar(id):
        feirante = feirantesRepository.buscarPorId(id)
        if not feirante:
            raise ValueError("feirante não encontrado")
        return feirante

    @staticmethod
    def atualizar(id, dados):
        if feirantesRepository.atualizar(id, dados) == 0:
            raise ValueError("Feirante não encontrado")
        return True