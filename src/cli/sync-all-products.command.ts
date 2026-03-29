import { QueueService } from '@shared/infrastructure/queue/queue';
import { SyncAllProductsUseCase } from '@modules/cin7-hubspot/application/use-cases/sync-all-products.use-case';
import { Cin7Client, Cin7ProductService } from '@uraaa/cin7';
import { hubspotLogger } from '@config/logger';

async function run() {
    try {
        hubspotLogger.info('Starting CLI: sync all products');

        const queueService = new QueueService();
        const cin7Client = new Cin7Client(
            process.env.CIN7_ACCOUNT_ID!,
            process.env.CIN7_APP_KEY!
        );

        const cin7Service = new Cin7ProductService(cin7Client);
        const useCase = new SyncAllProductsUseCase(
            cin7Service,
            queueService
        );

        await useCase.execute();

        hubspotLogger.info('CLI finished: all products queued');

        process.exit(0);
    } catch (error) {
        hubspotLogger.error({ error }, 'CLI failed');
        process.exit(1);
    }
}

run();