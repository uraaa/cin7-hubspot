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
}