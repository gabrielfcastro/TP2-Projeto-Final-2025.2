"use client";

export default function SearchPage() {
  const handlerBuscarProduto = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // impede o submit da página
    alert("Alguma coisa aqui");
  };

  return (
    <>
      Lista de Produtos
      <form onSubmit={handlerBuscarProduto}>
        <label htmlFor="produto-name">Pesquisar Produto</label>
        <input
          type="text"
          name="produto-name"
          id="produto-name"
          placeholder="Pesquisar produto"
        />

        <button type="submit">Buscar</button>
      </form>
    </>
  );
}
