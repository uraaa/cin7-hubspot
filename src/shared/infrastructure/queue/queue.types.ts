export type QueueJobName =
    | 'sync-product'
    | 'sync-all-products';

export interface SyncProductJob {
    sku: string;
}