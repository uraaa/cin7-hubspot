import { mapAvailabilityToWarehouseStocks } from '@uraaa/cin7';
import { QueueService } from '@shared/infrastructure/queue/queue';
import { cin7Logger } from '@config/logger';

export class Cin7WebhookHandlers {
    constructor(private queueService: QueueService) {}

    async handleProductEvent(payload: any): Promise<void> {
        const products = payload.ProductDetailsList || [];

        for (const product of products) {
            if (!product?.SKU || !product?.Event) continue;

            const sku = product.SKU;

            switch (product.Event) {
                case 'Creation':
                case 'Update':
                    await this.queueService.add('sync-product', { sku });
                    cin7Logger.info({ sku, event: product.Event }, 'Product job added to queue');
                    break;
                default:
                    cin7Logger.warn({ product: product }, 'Unknown product event');
            }
        }
    }

    async stockChanged(payload: any): Promise<void> {
        try {
            const stocks = mapAvailabilityToWarehouseStocks(payload);
            if (!stocks || Object.keys(stocks).length === 0) {
                cin7Logger.warn({ payload: payload }, 'No warehouse stocks');
                return;
            }

            const sku = payload?.SKU;
            if (!sku) {
                cin7Logger.warn({ payload: payload }, 'No SKU in stock payload');
                return;
            }

            await this.queueService.add('sync-stock', {
                sku: sku.trim(),
                stocks,
            });

            cin7Logger.info({ sku, stocks: stocks }, 'Stock job added to queue');
        } catch (error: any) {
            cin7Logger.error({ error, payload: payload }, 'Stock handler failed');
            throw error;
        }
    }
}