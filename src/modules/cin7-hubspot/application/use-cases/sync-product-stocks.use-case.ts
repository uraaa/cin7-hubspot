import { HubspotProductService, HubspotClient } from '@uraaa/hubspot';
import { hubspotLogger } from '@config/logger';

export class SyncProductStocksUseCase {
    constructor(
        private hubspotClient: HubspotClient,
        private hubspotService: HubspotProductService
    ) {}

    async execute(sku: string, stocks: Record<string, number>): Promise<void> {
        try {
            hubspotLogger.info({ sku, stocks }, 'Starting stock sync');

            const product = await this.hubspotService.getProductBySku(sku);
            if (!product || !product.id) {
                hubspotLogger.warn({ sku }, 'Product not found in HubSpot');
                return;
            }

            await this.hubspotClient.updateProduct(product.id, {
                warehouse_stocks: JSON.stringify(stocks),
            });

            hubspotLogger.info({ sku }, 'Stock sync completed');
        } catch (error) {
            hubspotLogger.error({ error, sku }, 'Stock sync failed');
            throw error;
        }
    }
}