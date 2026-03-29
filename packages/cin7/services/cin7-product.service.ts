import { Cin7Client } from '../api/cin7.client';
import { Cin7Product } from '../domain/cin7-product.model';
import { mapToCin7Product, mapAvailabilityToWarehouseStocks } from '../domain/cin7-product.mapper';

export class Cin7ProductService {
    constructor(private client: Cin7Client) {}

    async getFullProductBySku(sku: string): Promise<Cin7Product | null> {
        const product: any = await this.client.getProductBySku(sku);
        if (!product) return null;

        const availability: any[] = await this.client.getProductAvailabilityBySku(sku);
        const stocks = mapAvailabilityToWarehouseStocks(availability);
        
        return mapToCin7Product(product, stocks);
    }

    async *getProductsPaginated(limit: number = 100): AsyncGenerator<{ sku: string }> {
        let page = 1;
        let total = 0;
        let fetched = 0;

        do {
            const response = await this.client.getProducts(page, limit);
            const products = response.products;
            if (!products.length) break;
            
            total = response.total;

            for (const product of products) {
                if (product?.SKU) {
                    yield { sku: product.SKU.trim() };
                    fetched++;
                }
            }

            page++;
        } while (fetched < total || total === 0);
    }
}