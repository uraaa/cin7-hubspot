import axios from 'axios';
import fs from 'fs';
import path from 'path';

const TEMP_DIR = path.resolve(process.cwd(), 'storage/temp');

export async function downloadFile(url: string, fileName?: string): Promise<string> {
    if (!fs.existsSync(TEMP_DIR)) {
        fs.mkdirSync(TEMP_DIR, { recursive: true });
    }

    const resolvedFileName =
        fileName || path.basename(new URL(url).pathname) || `file-${Date.now()}`;

    const filePath = path.join(TEMP_DIR, resolvedFileName);

    const response = await axios.get(url, {
        responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
        response.data.pipe(writer);

        writer.on('finish', () => resolve(filePath));
        writer.on('error', reject);
    });
}