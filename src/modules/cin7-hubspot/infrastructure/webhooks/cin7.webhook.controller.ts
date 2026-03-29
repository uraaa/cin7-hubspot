import { BaseWebhookController } from '@shared/infrastructure/webhooks/webhook.controller';
import { Cin7WebhookHandlers } from './cin7.webhook.handlers';
import { cin7Logger } from '@config/logger';
import { FastifyRequest } from 'fastify';

export class Cin7WebhookController extends BaseWebhookController {
    constructor(private handlers: Cin7WebhookHandlers) {
        super();
    }

    protected async process(payload: any, request?: FastifyRequest): Promise<void> {
        let eventType = payload.EventType;

        if (!eventType && request) {
            eventType = request.headers['event-type'] as string;
        }

        if (!eventType) {
            eventType = 'unknown';
            cin7Logger.warn({ payload: payload, headers: request?.headers }, 'Webhook received without EventType');
        }
        
        switch (eventType) {
            case 'Product/Updated':
                await this.handlers.handleProductEvent(payload);
                break;
            case 'Stock/AvailableStockLevelChanged':
                await this.handlers.stockChanged(payload);
                break;
            default:
                cin7Logger.warn({ event: eventType }, 'Unhandled Cin7 webhook event');
        }
    }
}