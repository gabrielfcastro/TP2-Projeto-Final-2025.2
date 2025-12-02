import { ProductService } from "@/services/ProductService";

describe("Product Service", () => {
    let mockFetch: jest.Mock;
    let service: ProductService
    
    
    it("Exist ProducService", () => {
        expect(ProductService).toBeDefined();
    })
})