export type AspectRatio = '1:1' | '4:5' | '16:9' | '9:16' | '1.91:1';

export function normalizeAspectRatio(value?: string): AspectRatio {
  const allowed: readonly AspectRatio[] = ['1:1', '4:5', '16:9', '9:16', '1.91:1'];
  return allowed.includes(value as AspectRatio) ? (value as AspectRatio) : '1:1';
}
