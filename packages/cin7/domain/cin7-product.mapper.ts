import { Cin7Product } from './cin7-product.model';

export function mapToCin7Product(product: any, availability: any[]): Cin7Product {
    return {
        id: product.ID,
        sku: product.SKU,
        name: product.Name,
        price: product.PriceTiers?.Retail ?? product.PriceTier1 ?? 0,
        image: product.Attachments?.[0]?.DownloadUrl ?? '',
        stocks: availability.reduce<Record<string, number>>((acc, item) => {
            acc[item.Location ?? 'unknown'] = item.Available ?? 0;
            return acc;
        }, {}),
    };
}