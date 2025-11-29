import { render, screen } from "@testing-library/react"

describe("Página de pesquisa", () => {
    it("Renderizando Página de pesquisa de produtos sem errors", () => {

        render(<SearchPage />)

        expect(screen.getByText("Home")).toBeInTheDocument();
    })
})