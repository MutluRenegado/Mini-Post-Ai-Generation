export class PlatformTextPromptBuilder {
  public static buildPlatformPrompt(masterPost: string, platform: string): string {
    return `Adapt the following master post for ${platform}: "${masterPost}"`;
  }
}
