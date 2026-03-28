import cron from 'node-cron';
import { cleanupTempFiles } from '@shared/utils/cleanup-temp';
import { logger } from '@config/logger';

export function startCleanupTempCron() {
    cron.schedule('0 0 * * *', () => {
        logger.info('Running temp files cleanup job');

        try {
            cleanupTempFiles();
            logger.info('Temp files cleanup completed');
        } catch (error) {
            logger.error({ error }, 'Temp cleanup failed');
        }
    });
}