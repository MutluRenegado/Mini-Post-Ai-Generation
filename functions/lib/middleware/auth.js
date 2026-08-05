"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAuthToken = verifyAuthToken;
const auth_1 = require("firebase-admin/auth");
/**
 * Native Firebase Auth ID Token Verification Middleware
 */
async function verifyAuthToken(req, res) {
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
        const decodedToken = await (0, auth_1.getAuth)().verifyIdToken(idToken);
        req.user = decodedToken;
        return decodedToken;
    }
    catch (err) {
        console.error('[verifyAuthToken] ID Token verification failed:', err);
        res.status(401).json({
            success: false,
            error: 'Unauthorized: Invalid or expired Firebase ID token.',
        });
        return null;
    }
}
//# sourceMappingURL=auth.js.map