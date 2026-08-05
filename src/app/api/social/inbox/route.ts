import { NextRequest } from 'next/server';
import { GET as socialGet } from '../route';

export async function GET(req: NextRequest) {
  return socialGet(req);
}
