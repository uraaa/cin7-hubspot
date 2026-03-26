import { Cin7Product } from './cin7-product.model';

export function mapToCin7Product(product: any, stocks: Record<string, number>): Cin7Product {
    return {
        id: product.ID,
        sku: product.SKU,
        name: product.Name,
        price: product.PriceTiers?.Retail ?? product.PriceTier1 ?? 0,
        image: product.Attachments?.[0]?.DownloadUrl ?? '',
        stocks: stocks,
    };
}

export function mapAvailabilityToWarehouseStocks(availability?: any[]): Record<string, number> {
    if (!availability || availability.length === 0) {
        return {};
    }

    return availability
        .filter(item => item.Location?.trim().endsWith('Warehouse'))
        .reduce<Record<string, number>>((acc, item) => {
          acc[item.Location!] = item.Available ?? 0;
          return acc;
        }, {});
}