export interface BaseWebhookPayload<T = any> {
    Event: string;
    Data: T;
}

// export interface Cin7StockChangedData {
//   Sku: string;
//   ProductID: string;
// }

// export type Cin7WebhookPayload = BaseWebhookPayload<Cin7StockChangedData>;