import { Cin7Product } from '@uraaa/cin7';
import { HubspotProduct } from '@uraaa/hubspot';

export function mapToHubspotProduct(cin7Product: Cin7Product): HubspotProduct {
    return {
        id: undefined,
        sku: cin7Product.sku,
        name: cin7Product.name,
        price: cin7Product.price || 0,
        image: cin7Product.image || undefined,
        stocks: mapAvailabilityToHubspotStocks(cin7Product.stocks || {}),
    };
}

export function mapAvailabilityToHubspotStocks(stocks: Record<string, number>): Record<string, number> {
    const locationMap: Record<string, string> = {
        'California Warehouse': 'stock_warehouse_ca',
        'Illinois Warehouse': 'stock_warehouse_il',
        'Oklahoma Warehouse': 'stock_warehouse_ok',
        'Pennsylvania Warehouse': 'stock_warehouse_pa',
        'Texas Warehouse': 'stock_warehouse_tx',
        'Washington Warehouse': 'stock_warehouse_wa',
    };

    const result: Record<string, number> = Object.values(locationMap).reduce(
        (acc, key) => {
            acc[key] = 0;
            return acc;
        },
        {} as Record<string, number>
    );

    for (const [location, available] of Object.entries(stocks)) {
        const hubspotKey = locationMap[location];
        if (!hubspotKey) continue;
        result[hubspotKey] += available;
    }

    return result;
}