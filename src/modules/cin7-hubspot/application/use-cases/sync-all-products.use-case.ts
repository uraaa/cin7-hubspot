import { Cin7ProductService } from '@uraaa/cin7';
import { QueueService } from '@shared/infrastructure/queue/queue';
import { hubspotLogger } from '@config/logger';

export class SyncAllProductsUseCase {
    private readonly BATCH_SIZE = 50;

    constructor(
        private cin7Service: Cin7ProductService,
        private queueService: QueueService
    ) {}

    async execute(): Promise<void> {
        hubspotLogger.info('Starting full products sync');

        const queue = this.queueService.getQueue('sync-product');

        let batch: { name: string; data: any }[] = [];
        let total = 0;

        try {
            for await (const { sku } of this.cin7Service.getProductsPaginated(this.BATCH_SIZE)) {
                batch.push({ name: 'sync-product', data: { sku } });
 
                total++;

                if (batch.length >= this.BATCH_SIZE) {
                    await queue.addBulk(batch);
                    hubspotLogger.info({ processed: total }, 'Batch added to queue');
                    batch = [];
                }
            }

            if (batch.length > 0) {
                await queue.addBulk(batch);
                hubspotLogger.info({ processed: total }, 'Final batch added to queue');
            }

            hubspotLogger.info({ total: total }, 'Full products sync queued successfully');
        } catch (error) {
            hubspotLogger.error({ error }, 'Failed to enqueue full product sync');
            throw error;
        }
    }
}