import { NextRequest } from 'next/server';
import { POST as orchestratePost } from '../../orchestrate/route';

/**
 * Endpoint proxy delegating hashtag generation to consolidated orchestrator (/api/orchestrate)
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const modifiedReq = new NextRequest(req.url, {
    method: 'POST',
    headers: req.headers,
    body: JSON.stringify({ ...body, action: 'generate_hashtags' }),
  });

  return orchestratePost(modifiedReq);
}
