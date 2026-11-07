export interface CanvaApiOptions {
    accessToken?: string;
}
export declare class CanvaClient {
    private token;
    private designRevisions;
    constructor(options?: CanvaApiOptions);
    /**
     * Enterprise HTTP Client with Exponential Backoff & Jitter
     * Respects 429 Retry-After and retries on 502/503/504
     */
    private fetchWithRetry;
    /**
     * Optimistic Locking & Version Tracking
     * Prevents blind overwrite conflicts when multiple users edit on Canva Cloud
     */
    recordDesignVersion(designId: string, updatedAt: string, revision?: number): void;
    checkOptimisticLock(designId: string, currentCloudUpdatedAt?: string): {
        isConflict: boolean;
        reason?: string;
    };
    private getHeaders;
    getDesign(designId: string, signal?: AbortSignal): Promise<any>;
    listDesigns(query?: string, signal?: AbortSignal): Promise<unknown>;
    exportDesign(designId: string, format?: string, signal?: AbortSignal): Promise<unknown>;
    uploadAsset(imageUrl: string, assetName: string, signal?: AbortSignal): Promise<unknown>;
    getBrandKits(signal?: AbortSignal): Promise<unknown>;
    getBrandKit(brandKitId: string, signal?: AbortSignal): Promise<unknown>;
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
