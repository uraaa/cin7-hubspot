export interface Cin7Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    image?: string;
    stocks?: Record<string, number>;
}