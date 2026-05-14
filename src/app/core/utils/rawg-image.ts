const RAWG_MEDIA_HOST = 'media.rawg.io';
const MEDIA_PATH_PREFIX = '/media/';

/**
 * Insert a `resize/<width>/-/` transform into a RAWG media URL to request
 * a smaller version from the CDN. Keeps the original aspect ratio.
 *
 * Returns the original URL untouched when the host or shape doesn't match,
 * or when the URL already contains a resize/crop transform.
 */
export function resizeRawgImage(
  url: string | null,
  width: number,
): string | null {
  if (!url) return url;
  if (!url.includes(RAWG_MEDIA_HOST)) return url;

  const idx = url.indexOf(MEDIA_PATH_PREFIX);
  if (idx === -1) return url;

  const head = url.slice(0, idx + MEDIA_PATH_PREFIX.length);
  const tail = url.slice(idx + MEDIA_PATH_PREFIX.length);

  if (tail.startsWith('crop/') || tail.startsWith('resize/')) {
    return url;
  }

  return `${head}resize/${width}/-/${tail}`;
}
