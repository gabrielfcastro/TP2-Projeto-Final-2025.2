// services/ProductService.test.ts
import { Product, ProductService } from "@/services/Product/ProductService";
import { api } from "@/utils/api";

jest.mock("@/utils/api"); // mocka o módulo api

describe("ProductService", () => {
  let serviceProduct: ProductService;
  const mockedApiRequest = api.request as jest.MockedFunction<
    typeof api.request
  >;

  beforeEach(() => {
    serviceProduct = new ProductService();
    jest.clearAllMocks();
  });

  it("deve existir ProductService", () => {
    expect(ProductService).toBeDefined();
  });

  it("GET products list", async () => {
    const productsMock: Product[] = [
      { id: 1, nome: "Produto 1", preco: 100 },
      { id: 2, nome: "Produto 2", preco: 200 },
      { id: 3, nome: "Produto 3", preco: 300 },
    ];

    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(productsMock),
    } as unknown as Response;

    mockedApiRequest.mockResolvedValue(mockResponse);

    const products = await serviceProduct.getProducts();

    expect(products).toEqual(productsMock);
    expect(mockedApiRequest).toHaveBeenCalledWith("/api/produtos");
    expect(mockResponse.json).toHaveBeenCalled();
  });
});
