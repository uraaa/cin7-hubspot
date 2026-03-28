import fs from 'fs';
import path from 'path';

const TEMP_DIR = path.resolve(process.cwd(), 'storage/temp');

export function cleanupTempFiles(maxAgeMs: number = 24 * 60 * 60 * 1000) {
    if (!fs.existsSync(TEMP_DIR)) return;

    const files = fs.readdirSync(TEMP_DIR);
    const now = Date.now();

    files.forEach(file => {
        const filePath = path.join(TEMP_DIR, file);
        const stats = fs.statSync(filePath);

        if (now - stats.mtimeMs > maxAgeMs) {
            fs.unlinkSync(filePath);
        }
    });
}