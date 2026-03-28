import { Client } from '@hubspot/api-client';
import {
    PublicObjectSearchRequest,
    SimplePublicObject, 
    SimplePublicObjectWithAssociations,
    CollectionResponseWithTotalSimplePublicObjectForwardPaging
} from '@hubspot/api-client/lib/codegen/crm/products';

export class HubspotClient {
    private client: Client;

    constructor(accessToken: string) {
        this.client = new Client({ accessToken: accessToken });
    }

    get filesApi() {
        return this.client.files.filesApi;
    }

    get productsBasicApi() {
        return this.client.crm.products.basicApi;
    }

    get productsSearchApi() {
        return this.client.crm.products.searchApi;
    }

    async createProduct(properties: Record<string, any>) : Promise<SimplePublicObject> {
        try {
            return await this.productsBasicApi.create({ properties });
        } catch (error: any) {
            throw new Error(`HubSpot createProduct failed: ${error.message}`);
        }
    }

    async getProductById(id: string, properties: string[] = []) : Promise<SimplePublicObjectWithAssociations> {
        try {
            return await this.productsBasicApi.getById(id, properties);
        } catch (error: any) {
            throw new Error(`HubSpot getProductById failed: ${error.message}`);
        }
    }

    async updateProduct(id: string, properties: Record<string, any>) : Promise<SimplePublicObject> {
        try {
            return await this.productsBasicApi.update(id, { properties });
        } catch (error: any) {
            throw new Error(`HubSpot updateProduct failed: ${error.message}`);
        }
    }

    async searchProducts(searchRequest: PublicObjectSearchRequest) : Promise<CollectionResponseWithTotalSimplePublicObjectForwardPaging> {
        try {
            return await this.productsSearchApi.doSearch(searchRequest);
        } catch (error: any) {
            throw new Error(`HubSpot searchProducts failed: ${error.message}`);
        }
    }

    async uploadImage(fileName: string, fileBuffer: Buffer): Promise<string> {
        try {
            const file = {
                data: fileBuffer,
                name: fileName,
            };

            const response = await this.client.files.filesApi.upload(
                file,
                undefined,
                undefined,
                fileName,
                undefined,
                JSON.stringify({ access: 'PUBLIC_INDEXABLE' })
            );

            return response.defaultHostingUrl;
        } catch (error: any) {
            throw new Error(`HubSpot uploadImage failed: ${error.message}`);
        }
    }
}