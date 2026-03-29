import { FastifyInstance } from 'fastify';
import { Cin7WebhookController } from '@modules/cin7-hubspot/infrastructure/webhooks/cin7.webhook.controller'

type Controllers = {
    cin7WebhookController: Cin7WebhookController;
};

export async function registerApiRoutes(fastify: FastifyInstance, controllers: Controllers) {
    fastify.post('/webhook/cin7/product', (request, reply) => {
        return controllers.cin7WebhookController.handle(request, reply);
    });
}