import { Cin7ProductService } from '@uraaa/cin7';
import { HubspotProductService } from '@uraaa/hubspot';
import { mapToHubspotProduct } from '@modules/cin7-hubspot/mappers/cin7-to-hubspot.mapper';
import { hubspotLogger } from '@config/logger';
import { downloadFile } from '@shared/utils/download-file';
import fs from 'fs/promises';
import path from 'path';

export class SyncProductUseCase {
    constructor(
        private cin7Service: Cin7ProductService,
        private hubspotService: HubspotProductService
    ) {}

    async execute(sku: string): Promise<void> {
        try {
            hubspotLogger.info({ sku }, 'Starting product sync');

            const product = await this.cin7Service.getFullProductBySku(sku);
            if (!product) {
                hubspotLogger.warn({ sku }, 'Product not found in Cin7');
                return;
            }

            const hubspotProduct = mapToHubspotProduct(product);
            const productId = await this.hubspotService.upsertProduct(hubspotProduct);

            if (product.image) {
                let filePath: string | null = null;

                try {
                    filePath = await downloadFile(product.image, `${sku}.jpg`);
                    const buffer = await fs.readFile(filePath);
                    await this.hubspotService.setProductImage(productId, path.basename(filePath), buffer); 
                    
                    hubspotLogger.info({ sku }, 'Product image synced');
                } catch (error) {
                    hubspotLogger.error({ error, sku }, 'Failed to sync image');
                } finally {
                    if (filePath) {
                        try {
                            await fs.unlink(filePath);
                        } catch (error) {
                            hubspotLogger.warn({ sku, filePath }, 'Failed to delete temp file');
                        }
                    }
                }
            }

            hubspotLogger.info({ sku }, 'Product sync completed');
        } catch (error) {
            hubspotLogger.error({ error, sku }, 'Product sync failed');
            throw error;
        }
    }
}