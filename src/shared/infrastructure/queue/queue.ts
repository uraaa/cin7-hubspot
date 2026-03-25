import { Queue, Worker, Job } from 'bullmq';
import IORedis from 'ioredis';

const connection = new IORedis({
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
});

export class QueueService {
    private queues: Map<string, Queue> = new Map();

    getQueue(name: string): Queue {
        if (!this.queues.has(name)) {
            const queue = new Queue(name, { connection });
            this.queues.set(name, queue);
        }

        return this.queues.get(name)!;
    }

    async add(name: string, data: any) {
        const queue = this.getQueue(name);
        return queue.add(name, data);
    }

    createWorker(
        name: string,
        processor: (job: Job) => Promise<void>
    ): Worker {
        return new Worker(name, processor, { connection });
    }
}