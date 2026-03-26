import pino from 'pino';

export const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    transport: {
        target: 'pino-pretty',
        options: {
            colorize: true,
            translateTime: 'SYS:standard',
            ignore: 'pid,hostname'
        },
    },
});

export const hubspotLogger = logger.child({ service: 'hubspot' });
export const cin7Logger = logger.child({ service: 'cin7' });