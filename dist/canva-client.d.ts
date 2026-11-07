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
    /**
     * OAuth 2.1 Specification & Enterprise Security Metadata
     * Conforms to MCP Auth 2026 standard & Canva Developer Portal specs
     */
    getOAuth2Metadata(): {
        protocol: string;
        authorization_endpoint: string;
        token_endpoint: string;
        revocation_endpoint: string;
        code_challenge_methods_supported: string[];
        grant_types_supported: string[];
        response_types_supported: string[];
        scopes_supported: string[];
        client_auth_methods_supported: string[];
        current_status: string;
    };
}
