import "server-only";

function getRequiredSecret(name: string): string {
  const value = process.env[name];

  if (!value || value.trim() === "") {
    throw new Error(`Missing required secret: ${name}`);
  }

  return value;
}

export const secrets = {
  GOOGLE_GENERATIVE_AI_API_KEY: getRequiredSecret(
    "GOOGLE_GENERATIVE_AI_API_KEY"
  ),
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  TELEGRAM_API_KEY: process.env.TELEGRAM_API_KEY,
} as const;