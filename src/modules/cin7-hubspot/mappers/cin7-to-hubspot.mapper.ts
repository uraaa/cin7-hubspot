import { Cin7Product } from '@uraaa/cin7';
import { HubspotProduct } from '@uraaa/hubspot';

export function mapToHubspotProduct(cin7Product: Cin7Product): HubspotProduct {
    return {
        id: undefined,
        sku: cin7Product.sku,
        name: cin7Product.name,
        price: cin7Product.price || 0,
        image: cin7Product.image || undefined,
        stocks: cin7Product.stocks || {},
    };
}