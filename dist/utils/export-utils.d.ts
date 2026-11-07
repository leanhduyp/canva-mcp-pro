/**
 * Enterprise Multi-Tenant & Cross-Platform Dynamic Directory Resolver
 * Never breaks on foreign machines or Docker containers
 */
export declare function getArtifactDirectory(): string;
export declare const DEFAULT_ARTIFACT_DIR: string;
export declare function exportSlidePng(presentationPath: string, slideNumber: number, customOutputPath?: string): Promise<string>;
