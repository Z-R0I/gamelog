const RAWG_BASE = 'https://api.rawg.io/api';

interface VercelRequestLike {
  query: Record<string, string | string[] | undefined>;
}

interface VercelResponseLike {
  status(code: number): VercelResponseLike;
  setHeader(name: string, value: string): void;
  send(body: string): void;
  json(data: unknown): void;
}

export default async function handler(
  req: VercelRequestLike,
  res: VercelResponseLike,
): Promise<void> {
  try {
    const apiKey = process.env['RAWG_KEY'];
    if (!apiKey) {
      res.status(500).json({ error: 'RAWG_KEY env var not configured.' });
      return;
    }

    const pathValue = req.query['path'];
    const segments = Array.isArray(pathValue)
      ? pathValue
      : pathValue
        ? [pathValue]
        : [];
    const path = segments.join('/');
    const upstreamUrl = new URL(`${RAWG_BASE}/${path}`);

    for (const [key, value] of Object.entries(req.query)) {
      if (key === 'path' || value === undefined) continue;
      const flat = Array.isArray(value) ? value.join(',') : value;
      upstreamUrl.searchParams.set(key, String(flat));
    }
    upstreamUrl.searchParams.set('key', apiKey);

    const upstream = await fetch(upstreamUrl.toString(), {
      headers: { Accept: 'application/json' },
    });

    const contentType =
      upstream.headers.get('content-type') ?? 'application/json';
    const body = await upstream.text();

    res.setHeader('Content-Type', contentType);
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600',
    );
    res.status(upstream.status).send(body);
  } catch (err) {
    res.status(502).json({
      error: 'Upstream RAWG request failed.',
      detail: err instanceof Error ? err.message : 'unknown',
    });
  }
}
