import { Cin7WebhookHandlers } from './infrastructure/webhooks/cin7.webhook.handlers';
import { Cin7WebhookController } from './infrastructure/webhooks/cin7.webhook.controller';
import { SyncProductUseCase } from './application/use-cases/sync-product.use-case';
import { SyncProductStocksUseCase } from './application/use-cases/sync-product-stocks.use-case';
import { QueueService } from "@shared/infrastructure/queue/queue";
import { logger } from "@config/logger";
import { Cin7Client, Cin7ProductService } from '@uraaa/cin7';
import { HubspotClient, HubspotProductService } from '@uraaa/hubspot';

export class Cin7HubspotModule {
    public controller: Cin7WebhookController;

    constructor(queueService: QueueService) {
        const cin7Client = new Cin7Client(process.env.CIN7_ACCOUNT_ID || '', process.env.CIN7_APP_KEY || '');
        const hubspotClient = new HubspotClient(process.env.HUBSPOT_API_KEY || '');

        const cin7Service = new Cin7ProductService(cin7Client);
        const hubspotService = new HubspotProductService(hubspotClient);

        const syncProductUseCase = new SyncProductUseCase(
            cin7Service,
            hubspotService
        );

        const syncStockUseCase = new SyncProductStocksUseCase(
            hubspotClient,
            hubspotService
        );

        queueService.createWorker('sync-product', async (job) => {
            try {
                await syncProductUseCase.execute(job.data.sku);
            } catch (error) {
                logger.error({ error, jobData: job.data }, 'Error processing sync-product job');
                throw error;
            }
        });

        queueService.createWorker('sync-stock', async (job) => {
            try {
                await syncStockUseCase.execute(job.data.sku, job.data.stocks);
            } catch (error) {
                logger.error({ error, jobData: job.data }, 'Error processing sync-stock job');
                throw error;
            }
        });

        const handlers = new Cin7WebhookHandlers(queueService);

        this.controller = new Cin7WebhookController(handlers);
    }
}