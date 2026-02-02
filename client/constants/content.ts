/**
 * Public URL to the ASL content manifest (served from CDN/S3).
 *
 * This should point at the published `manifest.json` produced by the generator
 * pipeline (cloud-pipeline/scripts/upload_to_s3.py).
 */
export const CONTENT_MANIFEST_URL =
  process.env.EXPO_PUBLIC_CONTENT_MANIFEST_URL ?? "";
