const RAWG_BASE = 'https://api.rawg.io/api';

interface VercelReq {
  url?: string;
  query: Record<string, string | string[] | undefined>;
}

interface VercelRes {
  status(code: number): VercelRes;
  setHeader(name: string, value: string): void;
  send(body: string): void;
  json(data: unknown): void;
  end(): void;
}

export default async function handler(
  req: VercelReq,
  res: VercelRes,
): Promise<void> {
  try {
    const apiKey = process.env['RAWG_KEY'];
    if (!apiKey) {
      res.status(500).json({ error: 'RAWG_KEY env var not configured.' });
      return;
    }

    const pathParam = req.query['path'];
    const subPath = Array.isArray(pathParam)
      ? pathParam.join('/')
      : (pathParam ?? '');

    const upstreamUrl = new URL(`${RAWG_BASE}/${subPath}`);

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
