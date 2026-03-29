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

    const response = await axios({
        url,
        method: 'GET',
        responseType: 'stream',
        timeout: 5000,
    });

    const contentType = response.headers['content-type'];
    const contentLength = Number(response.headers['content-length']);

    if (!contentType?.startsWith('image/')) {
        throw new Error('Invalid file type');
    }

    if (contentLength > 5 * 1024 * 1024) {
        throw new Error('File too large');
    }

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);

    await new Promise((res, rej) => {
        writer.on('finish', res);
        writer.on('error', rej);
    });

    return filePath;
}

export async function downloadFileAsBuffer(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
}