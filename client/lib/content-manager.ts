/**
 * ContentManager - Manages offline caching of ASL video content
 *
 * Features:
 * - Download videos/animations to local storage
 * - Track download progress
 * - Check cached content status
 * - Clean up old content
 */

// expo-file-system v19 defaults to a new API; we use the legacy surface here
// because this app relies on DownloadResumable + documentDirectory helpers.
import * as FileSystem from "expo-file-system/legacy";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Types
export interface ContentItem {
  id: string;
  type: "video" | "animation" | "pose";
  remoteUrl: string;
  localUri?: string;
  scenario: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  englishText: string;
  gloss: string[];
  durationMs: number;
  sizeBytes?: number;
  downloadedAt?: number;
  version: string;
}

export interface ContentManifest {
  version: string;
  updatedAt: string;
  totalItems: number;
  scenarios: string[];
  items: ContentItem[];
}

export interface DownloadProgress {
  id: string;
  progress: number; // 0-100
  bytesWritten: number;
  totalBytes: number;
  status: "pending" | "downloading" | "complete" | "error";
  error?: string;
}

type ProgressCallback = (progress: DownloadProgress) => void;

// Constants
const CONTENT_DIR = `${FileSystem.documentDirectory ?? ""}asl-content/`;
const MANIFEST_KEY = "@asl-content-manifest";
const DOWNLOAD_STATE_KEY = "@asl-download-state";

/**
 * ContentManager singleton for managing offline ASL content
 */
class ContentManagerClass {
  private manifest: ContentManifest | null = null;
  private downloadQueue: Map<string, FileSystem.DownloadResumable> = new Map();
  private progressCallbacks: Map<string, ProgressCallback[]> = new Map();

  /**
   * Initialize the content manager
   */
  async initialize(): Promise<void> {
    // Ensure content directory exists
    const dirInfo = await FileSystem.getInfoAsync(CONTENT_DIR);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(CONTENT_DIR, { intermediates: true });
    }

    // Load cached manifest
    const manifestJson = await AsyncStorage.getItem(MANIFEST_KEY);
    if (manifestJson) {
      this.manifest = JSON.parse(manifestJson);
    }
  }

  /**
   * Fetch and update the content manifest from remote
   */
  async fetchManifest(manifestUrl: string): Promise<ContentManifest> {
    const response = await fetch(manifestUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch manifest: ${response.status}`);
    }

    const manifest: ContentManifest = await response.json();
    this.manifest = manifest;

    // Cache manifest
    await AsyncStorage.setItem(MANIFEST_KEY, JSON.stringify(manifest));

    return manifest;
  }

  /**
   * Get the current manifest (cached or fetched)
   */
  getManifest(): ContentManifest | null {
    return this.manifest;
  }

  /**
   * Check if content is cached locally
   */
  async isContentCached(itemId: string): Promise<boolean> {
    const localPath = this.getLocalPath(itemId);
    const info = await FileSystem.getInfoAsync(localPath);
    return info.exists;
  }

  /**
   * Get local URI for cached content
   */
  getLocalUri(itemId: string): string {
    return this.getLocalPath(itemId);
  }

  /**
   * Get content source (local if cached, remote otherwise)
   */
  async getContentSource(item: ContentItem): Promise<string> {
    const isCached = await this.isContentCached(item.id);
    return isCached ? this.getLocalUri(item.id) : item.remoteUrl;
  }

  /**
   * Download a single content item
   */
  async downloadContent(
    item: ContentItem,
    onProgress?: ProgressCallback,
  ): Promise<string> {
    const localPath = this.getLocalPath(item.id);

    // Check if already cached
    if (await this.isContentCached(item.id)) {
      onProgress?.({
        id: item.id,
        progress: 100,
        bytesWritten: item.sizeBytes || 0,
        totalBytes: item.sizeBytes || 0,
        status: "complete",
      });
      return localPath;
    }

    // Register progress callback
    if (onProgress) {
      const callbacks = this.progressCallbacks.get(item.id) || [];
      callbacks.push(onProgress);
      this.progressCallbacks.set(item.id, callbacks);
    }

    // Create download
    const downloadResumable = FileSystem.createDownloadResumable(
      item.remoteUrl,
      localPath,
      {},
      (progress) => {
        const percent = Math.round(
          (progress.totalBytesWritten / progress.totalBytesExpectedToWrite) *
            100,
        );
        const progressUpdate: DownloadProgress = {
          id: item.id,
          progress: percent,
          bytesWritten: progress.totalBytesWritten,
          totalBytes: progress.totalBytesExpectedToWrite,
          status: percent === 100 ? "complete" : "downloading",
        };
        this.notifyProgress(item.id, progressUpdate);
      },
    );

    this.downloadQueue.set(item.id, downloadResumable);

    try {
      const result = await downloadResumable.downloadAsync();
      if (!result?.uri) {
        throw new Error("Download failed - no URI returned");
      }

      // Update item with local info
      item.localUri = result.uri;
      item.downloadedAt = Date.now();

      this.notifyProgress(item.id, {
        id: item.id,
        progress: 100,
        bytesWritten: item.sizeBytes || 0,
        totalBytes: item.sizeBytes || 0,
        status: "complete",
      });

      return result.uri;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      this.notifyProgress(item.id, {
        id: item.id,
        progress: 0,
        bytesWritten: 0,
        totalBytes: item.sizeBytes || 0,
        status: "error",
        error: errorMessage,
      });
      throw error;
    } finally {
      this.downloadQueue.delete(item.id);
      this.progressCallbacks.delete(item.id);
    }
  }

  /**
   * Download all content for a scenario
   */
  async downloadScenario(
    scenario: string,
    onProgress?: (overall: number, current: DownloadProgress) => void,
  ): Promise<void> {
    if (!this.manifest) {
      throw new Error("Manifest not loaded");
    }

    const items = this.manifest.items.filter((i) => i.scenario === scenario);
    let completed = 0;

    for (const item of items) {
      await this.downloadContent(item, (progress) => {
        if (progress.status === "complete") {
          completed++;
        }
        onProgress?.(Math.round((completed / items.length) * 100), progress);
      });
    }
  }

  /**
   * Cancel a download in progress
   */
  async cancelDownload(itemId: string): Promise<void> {
    const download = this.downloadQueue.get(itemId);
    if (download) {
      await download.pauseAsync();
      this.downloadQueue.delete(itemId);
    }
  }

  /**
   * Delete cached content
   */
  async deleteContent(itemId: string): Promise<void> {
    const localPath = this.getLocalPath(itemId);
    const info = await FileSystem.getInfoAsync(localPath);
    if (info.exists) {
      await FileSystem.deleteAsync(localPath);
    }
  }

  /**
   * Delete all cached content for a scenario
   */
  async deleteScenario(scenario: string): Promise<void> {
    if (!this.manifest) return;

    const items = this.manifest.items.filter((i) => i.scenario === scenario);
    for (const item of items) {
      await this.deleteContent(item.id);
    }
  }

  /**
   * Clear all cached content
   */
  async clearCache(): Promise<void> {
    await FileSystem.deleteAsync(CONTENT_DIR, { idempotent: true });
    await FileSystem.makeDirectoryAsync(CONTENT_DIR, { intermediates: true });
    await AsyncStorage.removeItem(MANIFEST_KEY);
    this.manifest = null;
  }

  /**
   * Get cache size in bytes
   */
  async getCacheSize(): Promise<number> {
    const info = await FileSystem.getInfoAsync(CONTENT_DIR);
    if (!info.exists) return 0;

    let totalSize = 0;
    const files = await FileSystem.readDirectoryAsync(CONTENT_DIR);

    for (const file of files) {
      const fileInfo = await FileSystem.getInfoAsync(`${CONTENT_DIR}${file}`);
      if (fileInfo.exists && !fileInfo.isDirectory && fileInfo.size) {
        totalSize += fileInfo.size;
      }
    }

    return totalSize;
  }

  /**
   * Get items by scenario
   */
  getItemsByScenario(scenario: string): ContentItem[] {
    return this.manifest?.items.filter((i) => i.scenario === scenario) || [];
  }

  /**
   * Get items by difficulty
   */
  getItemsByDifficulty(
    difficulty: "beginner" | "intermediate" | "advanced",
  ): ContentItem[] {
    return (
      this.manifest?.items.filter((i) => i.difficulty === difficulty) || []
    );
  }

  // Private helpers

  private getLocalPath(itemId: string): string {
    // Sanitize itemId for filesystem
    const safeId = itemId.replace(/[^a-zA-Z0-9_-]/g, "_");
    return `${CONTENT_DIR}${safeId}.mp4`;
  }

  private notifyProgress(itemId: string, progress: DownloadProgress): void {
    const callbacks = this.progressCallbacks.get(itemId) || [];
    callbacks.forEach((cb) => cb(progress));
  }
}

// Export singleton instance
export const ContentManager = new ContentManagerClass();
