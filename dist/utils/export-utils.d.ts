export declare const CANVA_MCP_TMP_TTL_SECONDS: number;
export declare const CANVA_MCP_MAX_WORKSPACE_MB: number;
/**
 * Calculates total size of files inside a directory (recursive)
 */
export declare function calculateDirectorySize(dirPath: string): Promise<number>;
/**
 * Enterprise Auto-Purge: Scans and removes expired workspace sessions
 * Prevents Disk Exhaustion DoS attacks
 */
export declare function cleanupExpiredWorkspaces(ttlSeconds?: number): Promise<{
    cleanedDirs: number;
    reclaimedBytes: number;
}>;
/**
 * Enterprise Multi-Tenant & Cross-Platform Dynamic Directory Resolver
 * Generates an isolated session directory with 0700 permissions
 */
export declare function getArtifactDirectory(sessionId?: string): string;
export declare const DEFAULT_ARTIFACT_DIR: string;
export declare function exportSlidePng(presentationPath: string, slideNumber: number, customOutputPath?: string): Promise<string>;
