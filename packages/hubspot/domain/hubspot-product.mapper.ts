import { HubspotProduct } from './hubspot-product.model';

export function mapFromHubspotProduct(data: any, warehouseFields: string[] = []): HubspotProduct {
    const properties = data.properties || {};
    const stocks: Record<string, number> = {};

    for (const field of warehouseFields) {
        if (properties[field] !== undefined) {
            stocks[field] = Number(properties[field]) || 0;
        }
    }

    return {
        id: data.id,
        name: properties.name || '',
        sku: properties.hs_sku || '',
        price: Number(properties.price) || 0,
        image: properties.hs_images || undefined,
        stocks,
    };
}

export function mapToHubspotProperties(product: HubspotProduct): Record<string, any> {
    const properties: Record<string, any> = {
        name: product.name,
        hs_sku: product.sku,
        price: String(product.price),
    };

    if (product.image) {
        properties.hs_images = product.image;
    }

    for (const [key, value] of Object.entries(product.stocks)) {
        properties[key] = String(value);
    }

    return properties;
}