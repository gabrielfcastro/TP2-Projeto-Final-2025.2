export interface Product {
    id: number;
    nome: string;
    preco: number;
}


export class ProductService {
    constructor(private fercher: typeof fetch = fetch) {}
}