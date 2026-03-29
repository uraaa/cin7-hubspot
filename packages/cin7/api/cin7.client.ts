import axios, { AxiosInstance } from 'axios';

export class Cin7Client {
    private client: AxiosInstance;

    constructor(private accountId: string, private appKey: string) {
        this.client = axios.create({
            baseURL: 'https://inventory.dearsystems.com/ExternalApi/v2',
            headers: {
                'Content-Type': 'application/json',
                'api-auth-accountid': this.accountId,
                'api-auth-applicationkey': this.appKey,
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
            throw new Error(error.message);
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
              throw new Error(error.message);
        }
    }

    async getProducts(page: number = 1, limit: number = 100): Promise<{
        products: any[];
        total: number;
        page: number;
    }> {
        try {
            const response = await this.client.get('/product', {
                params: {
                    Page: page,
                    Limit: limit,
                },
            });

            return {
                products: response.data.Products || [],
                total: response.data.Total || 0,
                page: response.data.Page || page,
            };
        } catch (error: any) {
            throw new Error(error.message);
        }
    }

    async getProductAvailabilityBySku(sku: string): Promise<any> {
        try {
            const response = await this.client.get('/ref/productavailability', {
                params: {
                    Sku: sku,
                    Limit: 100
                }
            });
            return response.data.ProductAvailabilityList;
        } catch (error: any) {
            throw new Error(error.message);
        }
    }
}