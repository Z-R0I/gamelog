const RAWG_MEDIA_HOST = 'media.rawg.io';
const MEDIA_PATH_PREFIX = '/media/';

/**
 * Insert a resize transform into a RAWG media URL.
 *
 * RAWG CDN supports transforms via URL path:
 *   crop/<W>/<H>/<rest>      → cropped to exact dimensions
 *   resize/<W>/-/<rest>      → resized keeping aspect ratio
 *
 * Returns the original URL untouched when the host or shape doesn't match.
 */
export function resizeRawgImage(
  url: string | null,
  width: number,
  height?: number,
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

  const transform = height ? `crop/${width}/${height}/` : `resize/${width}/-/`;
  return `${head}${transform}${tail}`;
}
