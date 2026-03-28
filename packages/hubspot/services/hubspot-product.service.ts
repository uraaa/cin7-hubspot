import { HubspotClient } from '../api/hubspot.client';
import { HubspotProduct } from '../domain/hubspot-product.model';
import { mapToHubspotProperties, mapFromHubspotProduct} from '../domain/hubspot-product.mapper';
import { FilterOperatorEnum } from '@hubspot/api-client/lib/codegen/crm/products';

export class HubspotProductService {
    constructor(private client: HubspotClient) {}

    async getProductBySku(sku: string) : Promise<HubspotProduct | null> {
        const response = await this.client.searchProducts({
            filterGroups: [
                {
                    filters: [
                        {
                            propertyName: 'hs_sku',
                            operator: FilterOperatorEnum.Eq,
                            value: sku,
                        },
                    ],
                },
            ],
            properties: ['name', 'hs_sku', 'price', 'hs_images'],
            limit: 1,
        });

        const product = response.results?.[0];
        return product ? mapFromHubspotProduct(product) : null;
    }

    async upsertProduct(product: HubspotProduct) : Promise<string> {
        const existing = await this.getProductBySku(product.sku);
        const properties = mapToHubspotProperties(product);

        if (existing && existing.id) {
            await this.client.updateProduct(existing.id, properties);
            return existing.id;
        }

        const created = await this.client.createProduct(properties);
        return created.id;
    }

    async setProductImage(productId: string, fileName: string, fileBuffer: Buffer): Promise<void> {
        const imageUrl = await this.client.uploadImage(fileName, fileBuffer);
        await this.client.updateProduct(productId, { hs_images: imageUrl });
    }
}