import Fastify from 'fastify';
import { QueueService } from '@shared/infrastructure/queue/queue';
import { Cin7HubspotModule } from '@modules/cin7-hubspot/cin7-hubspot.module';
import { registerApiRoutes } from './routes/api.routes';

async function start() {
    const fastify = Fastify({ logger: true });
    const queueService = new QueueService();
    const cin7Module = new Cin7HubspotModule(queueService);

    await registerApiRoutes(fastify, {
        cin7WebhookController: cin7Module.controller,
    });

    await fastify.listen({ port: 3000 });
}

start();