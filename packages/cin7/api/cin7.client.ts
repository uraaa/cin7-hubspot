import axios, { AxiosInstance } from 'axios';

export class Cin7Client {
    private client: AxiosInstance;

    constructor(private accountId: string, private apiKey: string) {
        this.client = axios.create({
            baseURL: 'https://inventory.dearsystems.com/ExternalApi/v2',
            headers: {
                'Content-Type': 'application/json',
                'api-auth-accountid': this.accountId,
                'api-auth-applicationkey': this.apiKey,
            },
        });
    }

    async getProductById(id: string) : Promise<any> {
        try {
            const response = await this.client.get('/product', {
                params: {
                    ID: id,
                    IncludeAttachments: true
                }
            });
            return response.data.Products?.[0] || null;
        } catch (error: any) {
            console.error('Cin7 getProductById error: ', error.response?.data || error.message);
            throw new Error('Failed to fetch product from Cin7');
        }
    }

    async getProductBySku(sku: string): Promise<any> {
        try {
            const response = await this.client.get('/product', {
                params: {
                    Sku: sku,
                    IncludeAttachments: true
                }
            });
            return response.data.Products?.[0] || null;
        } catch (error: any) {
            console.error('Cin7 getProductBySku error: ', error.response?.data || error.message);
            throw new Error('Failed to fetch product from Cin7');
        }
    }

    async getProductAvailabilityBySku(sku: string): Promise<any> {
        try {
            const response = await this.client.get('/ref/productavailability', {
                params: {
                    Sku: sku,
                    Limit: 10
                }
            });
            return response.data.ProductAvailabilityList;
        } catch (error: any) {
            console.error('Cin7 getProductAvailabilityBySku error: ', error.response?.data || error.message);
            throw new Error('Failed to fetch product availability from Cin7');
        }
    }
}