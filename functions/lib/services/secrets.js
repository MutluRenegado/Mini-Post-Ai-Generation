"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allSecrets = exports.webhookSecret = exports.geminiApiKey2Secret = exports.googleApiKeySecret = exports.geminiApiKeySecret = exports.legacyPostproxyApiKeySecret = exports.postproxyDefaultApiKeySecret = exports.postproxyMasterApiKeySecret = exports.postproxyMegaApiKeySecret = void 0;
exports.getPostProxyApiKey = getPostProxyApiKey;
const params_1 = require("firebase-functions/params");
exports.postproxyMegaApiKeySecret = (0, params_1.defineSecret)('POST_PROXY_MEGA_API_KEY');
exports.postproxyMasterApiKeySecret = (0, params_1.defineSecret)('POST_PROXY_MASTER_API_KEY');
exports.postproxyDefaultApiKeySecret = (0, params_1.defineSecret)('POST_PROXY_DEFAULT_API_KEY');
exports.legacyPostproxyApiKeySecret = (0, params_1.defineSecret)('POSTPROXY_API_KEY');
exports.geminiApiKeySecret = (0, params_1.defineSecret)('GEMINI_SECRET_KEY');
exports.googleApiKeySecret = (0, params_1.defineSecret)('GOOGLE_API_KEY');
exports.geminiApiKey2Secret = (0, params_1.defineSecret)('GEMINI_API_KEY');
exports.webhookSecret = (0, params_1.defineSecret)('POSTPROXY_WEBHOOK_SECRET');
exports.allSecrets = [
    exports.postproxyMegaApiKeySecret,
    exports.postproxyMasterApiKeySecret,
    exports.postproxyDefaultApiKeySecret,
    exports.legacyPostproxyApiKeySecret,
    exports.geminiApiKeySecret,
    exports.googleApiKeySecret,
    exports.geminiApiKey2Secret,
    exports.webhookSecret,
];
function getPostProxyApiKey() {
    return (exports.postproxyMegaApiKeySecret.value() ||
        exports.postproxyMasterApiKeySecret.value() ||
        exports.postproxyDefaultApiKeySecret.value() ||
        exports.legacyPostproxyApiKeySecret.value() ||
        process.env.POST_PROXY_MEGA_API_KEY ||
        process.env.POST_PROXY_MASTER_API_KEY ||
        process.env.POST_PROXY_DEFAULT_API_KEY ||
        process.env.POSTPROXY_API_KEY ||
        process.env.Post_Proxy_Master_Api_Key ||
        process.env.Post_Proxy_Default_Api_Key ||
        '');
}
//# sourceMappingURL=secrets.js.map