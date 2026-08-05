import { defineSecret } from 'firebase-functions/params';

export const postproxyMegaApiKeySecret = defineSecret('POST_PROXY_MEGA_API_KEY');
export const postproxyMasterApiKeySecret = defineSecret('POST_PROXY_MASTER_API_KEY');
export const postproxyDefaultApiKeySecret = defineSecret('POST_PROXY_DEFAULT_API_KEY');
export const legacyPostproxyApiKeySecret = defineSecret('POSTPROXY_API_KEY');

export const geminiApiKeySecret = defineSecret('GEMINI_SECRET_KEY');
export const googleApiKeySecret = defineSecret('GOOGLE_API_KEY');
export const geminiApiKey2Secret = defineSecret('GEMINI_API_KEY');
export const webhookSecret = defineSecret('POSTPROXY_WEBHOOK_SECRET');

export const allSecrets = [
  postproxyMegaApiKeySecret,
  postproxyMasterApiKeySecret,
  postproxyDefaultApiKeySecret,
  legacyPostproxyApiKeySecret,
  geminiApiKeySecret,
  googleApiKeySecret,
  geminiApiKey2Secret,
  webhookSecret,
];

export function getPostProxyApiKey(): string {
  return (
    postproxyMegaApiKeySecret.value() ||
    postproxyMasterApiKeySecret.value() ||
    postproxyDefaultApiKeySecret.value() ||
    legacyPostproxyApiKeySecret.value() ||
    process.env.POST_PROXY_MEGA_API_KEY ||
    process.env.POST_PROXY_MASTER_API_KEY ||
    process.env.POST_PROXY_DEFAULT_API_KEY ||
    process.env.POSTPROXY_API_KEY ||
    process.env.Post_Proxy_Master_Api_Key ||
    process.env.Post_Proxy_Default_Api_Key ||
    ''
  );
}
