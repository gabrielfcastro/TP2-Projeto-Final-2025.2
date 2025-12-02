import SearchPage from "@/app/search-page/page";
import { render, screen } from "@testing-library/react"

describe("Página de pesquisa", () => {
    it("Renderizando Página de pesquisa de produtos sem errors", () => {
        const { container } = render(<SearchPage />)
        expect(container).not.toBeEmptyDOMElement()
    })

    it("contem botão de pesquisar produto", () => {
        render(<SearchPage />)
        expect(screen.getByText("Buscar")).toBeInTheDocument();
    })

    it("contem input de pesquisa", () => {
        render(<SearchPage />)
        expect(screen.getByPlaceholderText("Pesquisar produto")).toBeInTheDocument();
    })

    
})