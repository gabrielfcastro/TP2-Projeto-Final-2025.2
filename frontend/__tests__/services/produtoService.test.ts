import { Product, ProductService } from "@/services/ProductService";

describe("Product Service", () => {
  let mockFetch: jest.Mock;
  let serviceProduct: ProductService;

  beforeEach(() => {
    mockFetch = jest.fn();
    serviceProduct = new ProductService(mockFetch);
  });

  it("Exist ProducService", () => {
    expect(ProductService).toBeDefined();
  });

  it("GET products list", async () => {
    const productsMock: Product[] = [
      { id: 1, nome: "Produto 1", preco: 100 },
      { id: 2, nome: "Produto 2", preco: 200 },
      { id: 3, nome: "Produto 3", preco: 300 },
    ];

    mockFetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(productsMock),
    });

    const products = await serviceProduct.getProducts();

    expect(products).toEqual(productsMock);
    expect(mockFetch).toHaveBeenCalledWith("/api/produtos");
  });
});
