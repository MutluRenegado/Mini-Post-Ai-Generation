import { NextRequest } from 'next/server';
import { POST as orchestratePost } from '../orchestrate/route';

/**
 * Endpoint proxy delegating long-form article generation to consolidated orchestrator (/api/orchestrate)
 */
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const topic = body.coreIdea || body.prompt || body.topic;

  const modifiedReq = new NextRequest(req.url, {
    method: 'POST',
    headers: req.headers,
    body: JSON.stringify({
      ...body,
      topic,
      action: 'generate_text',
      textAction: 'full_article',
    }),
  });

  return orchestratePost(modifiedReq);
}
