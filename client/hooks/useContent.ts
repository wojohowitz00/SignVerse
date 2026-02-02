/**
 * useContent - React hook for managing ASL content
 *
 * Provides easy access to ContentManager functionality with React state
 */

import { useState, useEffect, useCallback } from "react";
import {
  ContentManager,
  ContentItem,
  ContentManifest,
  DownloadProgress,
} from "@/lib/content-manager";
import { CONTENT_MANIFEST_URL } from "@/constants/content";

interface UseContentOptions {
  /** URL to fetch manifest from */
  manifestUrl?: string;
  /** Auto-load manifest on mount */
  autoLoad?: boolean;
}

interface UseContentReturn {
  /** Current manifest (null if not loaded) */
  manifest: ContentManifest | null;
  /** Loading state for manifest */
  isLoading: boolean;
  /** Error message if any */
  error: string | null;
  /** Refresh manifest from remote */
  refreshManifest: () => Promise<void>;
  /** Download a content item */
  downloadItem: (item: ContentItem) => Promise<string>;
  /** Download all items in a scenario */
  downloadScenario: (scenario: string) => Promise<void>;
  /** Check if item is cached */
  isCached: (itemId: string) => Promise<boolean>;
  /** Get source URL (local or remote) */
  getSource: (item: ContentItem) => Promise<string>;
  /** Current download progress (by item ID) */
  downloadProgress: Map<string, DownloadProgress>;
  /** Overall cache size in bytes */
  cacheSize: number;
  /** Clear all cached content */
  clearCache: () => Promise<void>;
}

export function useContent(options: UseContentOptions = {}): UseContentReturn {
  const { manifestUrl, autoLoad = true } = options;
  const effectiveManifestUrl = manifestUrl ?? CONTENT_MANIFEST_URL;

  const [manifest, setManifest] = useState<ContentManifest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState<
    Map<string, DownloadProgress>
  >(new Map());
  const [cacheSize, setCacheSize] = useState(0);

  // Initialize on mount
  useEffect(() => {
    const init = async () => {
      await ContentManager.initialize();
      const cached = ContentManager.getManifest();
      if (cached) {
        setManifest(cached);
      }
      const size = await ContentManager.getCacheSize();
      setCacheSize(size);
    };
    init();
  }, []);

  // Auto-load manifest if URL provided
  useEffect(() => {
    if (autoLoad && effectiveManifestUrl && !manifest) {
      refreshManifest();
    }
  }, [effectiveManifestUrl, autoLoad]);

  const refreshManifest = useCallback(async () => {
    if (!effectiveManifestUrl) {
      setError("No manifest URL provided");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const newManifest =
        await ContentManager.fetchManifest(effectiveManifestUrl);
      setManifest(newManifest);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load manifest");
    } finally {
      setIsLoading(false);
    }
  }, [effectiveManifestUrl]);

  const downloadItem = useCallback(
    async (item: ContentItem): Promise<string> => {
      const updateProgress = (progress: DownloadProgress) => {
        setDownloadProgress((prev) => {
          const next = new Map(prev);
          next.set(item.id, progress);
          return next;
        });
      };

      const uri = await ContentManager.downloadContent(item, updateProgress);
      const size = await ContentManager.getCacheSize();
      setCacheSize(size);
      return uri;
    },
    [],
  );

  const downloadScenario = useCallback(
    async (scenario: string): Promise<void> => {
      await ContentManager.downloadScenario(scenario, (_overall, progress) => {
        setDownloadProgress((prev) => {
          const next = new Map(prev);
          next.set(progress.id, progress);
          return next;
        });
      });
      const size = await ContentManager.getCacheSize();
      setCacheSize(size);
    },
    [],
  );

  const isCached = useCallback(async (itemId: string): Promise<boolean> => {
    return ContentManager.isContentCached(itemId);
  }, []);

  const getSource = useCallback(async (item: ContentItem): Promise<string> => {
    return ContentManager.getContentSource(item);
  }, []);

  const clearCache = useCallback(async () => {
    await ContentManager.clearCache();
    setCacheSize(0);
    setDownloadProgress(new Map());
  }, []);

  return {
    manifest,
    isLoading,
    error,
    refreshManifest,
    downloadItem,
    downloadScenario,
    isCached,
    getSource,
    downloadProgress,
    cacheSize,
    clearCache,
  };
}

/**
 * Hook for a single content item
 */
export function useContentItem(item: ContentItem | null) {
  const [source, setSource] = useState<string | null>(null);
  const [isCached, setIsCached] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!item) {
      setIsLoading(false);
      return;
    }

    const load = async () => {
      setIsLoading(true);
      const cached = await ContentManager.isContentCached(item.id);
      setIsCached(cached);
      const uri = await ContentManager.getContentSource(item);
      setSource(uri);
      setIsLoading(false);
    };
    load();
  }, [item?.id]);

  return { source, isCached, isLoading };
}
