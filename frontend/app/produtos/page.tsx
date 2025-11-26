interface Produto {
  id: number;
  nome: string;
  preco: number;
}

async function getProdutos() {
  try {
    // Tenta buscar do seu Python na porta 5000
    const res = await fetch("http://127.0.0.1:5000/api/produtos", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Falha ao buscar dados");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function ProdutosPage() {
  const produtos: Produto[] = await getProdutos();

  return (
    <main className="container mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Lista de Produtos
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {produtos.length === 0 ? (
          <p className="text-red-500">
            Nenhum produto encontrado ou erro na conexão.
          </p>
        ) : (
          produtos.map((prod) => (
            <div
              key={prod.id}
              className="border p-6 rounded-lg shadow hover:shadow-lg transition bg-white text-gray-800"
            >
              <h2 className="text-xl font-semibold">{prod.nome}</h2>
              <p className="text-2xl font-bold text-green-600 mt-2">
                R$ {prod.preco.toFixed(2)}
              </p>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
