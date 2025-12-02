import type Product from "@/types/ProductType";

export const mockProducts: Product[] = [
	{
		id: 1,
		nome: "Tomate Orgânico",
		descricao: "Tomates frescos e orgânicos, colhidos diariamente",
		preco: 8.5,
		latitude: -23.5505,
		longitude: -46.6333,
		avaliacao_media: 4.8,
		total_avaliacoes: 120,
		data_criacao: "2024-01-15T10:00:00Z",
	},
	{
		id: 2,
		nome: "Alface Crespa",
		descricao: "Alface crespa fresca, ideal para saladas",
		preco: 4.2,
		latitude: -23.5515,
		longitude: -46.6343,
		avaliacao_media: 4.6,
		total_avaliacoes: 85,
		data_criacao: "2024-01-16T08:30:00Z",
	},
	{
		id: 3,
		nome: "Cenoura",
		descricao: "Cenouras frescas e doces, ricas em vitamina A",
		preco: 6.0,
		latitude: -23.5525,
		longitude: -46.6353,
		avaliacao_media: 4.9,
		total_avaliacoes: 150,
		data_criacao: "2024-01-17T09:15:00Z",
	},
	{
		id: 4,
		nome: "Banana Prata",
		descricao: "Bananas prata maduras e doces",
		preco: 5.5,
		latitude: -23.5535,
		longitude: -46.6363,
		avaliacao_media: 4.7,
		total_avaliacoes: 95,
		data_criacao: "2024-01-18T07:45:00Z",
	},
	{
		id: 5,
		nome: "Abóbora",
		descricao: "Abóbora fresca, ideal para sopas e refogados",
		preco: 7.8,
		latitude: -23.5545,
		longitude: -46.6373,
		avaliacao_media: 4.5,
		total_avaliacoes: 70,
		data_criacao: "2024-01-19T11:20:00Z",
	},
];

export const getMockProduct = (id: number): Product | undefined => {
	return mockProducts.find((product) => product.id === id);
};

