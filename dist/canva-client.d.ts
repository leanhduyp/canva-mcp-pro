export interface CanvaApiOptions {
    accessToken?: string;
}
export declare class CanvaClient {
    private token;
    constructor(options?: CanvaApiOptions);
    private getHeaders;
    getDesign(designId: string, signal?: AbortSignal): Promise<unknown>;
    listDesigns(query?: string, signal?: AbortSignal): Promise<unknown>;
    createAssetUploadUrl(signal?: AbortSignal): Promise<unknown>;
    uploadAsset(imageUrl: string, assetName: string, signal?: AbortSignal): Promise<unknown>;
    getBrandKits(signal?: AbortSignal): Promise<unknown>;
    getBrandKit(brandKitId: string, signal?: AbortSignal): Promise<unknown>;
    autofillBrandTemplate(templateId: string, title: string, dataset: Record<string, any>, signal?: AbortSignal): Promise<unknown>;
    exportDesign(designId: string, format?: string, signal?: AbortSignal): Promise<unknown>;
    getDesignComments(designId: string, signal?: AbortSignal): Promise<unknown>;
    createDesignComment(designId: string, message: string, threadId?: string, signal?: AbortSignal): Promise<unknown>;
}
