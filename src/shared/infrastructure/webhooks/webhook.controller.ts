import { FastifyReply, FastifyRequest } from 'fastify';

export abstract class BaseWebhookController {
    async handle(request: FastifyRequest, reply: FastifyReply) {
        try {
            await this.process(request.body);
            return reply.status(200).send({ success: true });
        } catch (error) {
            console.error('Webhook error:', error);
            return reply.status(500).send({
                success: false,
                message: 'Webhook processing failed',
            });
        }
    }

    protected abstract process(payload: any): Promise<void>;
}