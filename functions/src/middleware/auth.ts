import { Request } from 'firebase-functions/v2/https';
import { Response } from 'express';
import { getAuth, DecodedIdToken } from 'firebase-admin/auth';

export interface AuthenticatedRequest extends Request {
  user?: DecodedIdToken;
}

/**
 * Native Firebase Auth ID Token Verification Middleware
 */
export async function verifyAuthToken(
  req: AuthenticatedRequest,
  res: Response
): Promise<DecodedIdToken | null> {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Missing or malformed Authorization Bearer token.',
    });
    return null;
  }

  const idToken = authHeader.split('Bearer ')[1].trim();

  try {
    const decodedToken = await getAuth().verifyIdToken(idToken);
    req.user = decodedToken;
    return decodedToken;
  } catch (err) {
    console.error('[verifyAuthToken] ID Token verification failed:', err);
    res.status(401).json({
      success: false,
      error: 'Unauthorized: Invalid or expired Firebase ID token.',
    });
    return null;
  }
}
