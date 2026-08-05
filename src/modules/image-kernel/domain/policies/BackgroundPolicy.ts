export function assertBackgroundSubordinate(background: string): void {
  if (!background.trim()) throw new Error('BACKGROUND_CONTEXT_REQUIRED');
}
