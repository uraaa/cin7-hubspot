export interface HubspotProduct {
    id?: string;
    name: string;
    sku: string;
    price: number;
    image?: string;
    stocks: Record<string, number>;
}