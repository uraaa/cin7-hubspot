import { HubspotProductService, HubspotClient } from '@uraaa/hubspot';
import { hubspotLogger } from '@config/logger';
import { mapAvailabilityToHubspotStocks } from '@modules/cin7-hubspot/mappers/cin7-to-hubspot.mapper';

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
            
            const hubspotStocks = mapAvailabilityToHubspotStocks(stocks);
            await this.hubspotClient.updateProduct(product.id, { hubspotStocks });

            hubspotLogger.info({ sku }, 'Stock sync completed');
        } catch (error) {
            hubspotLogger.error({ error, sku }, 'Stock sync failed');
            throw error;
        }
    }
}