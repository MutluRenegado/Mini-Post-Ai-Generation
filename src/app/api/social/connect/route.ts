import { NextRequest } from 'next/server';
import { POST as socialPost } from '../route';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const modifiedReq = new NextRequest(req.url, {
    method: 'POST',
    headers: req.headers,
    body: JSON.stringify({ ...body, action: 'connect' }),
  });
  return socialPost(modifiedReq);
}
