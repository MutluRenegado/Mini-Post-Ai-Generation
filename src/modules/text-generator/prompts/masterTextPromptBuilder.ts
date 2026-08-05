export class MasterTextPromptBuilder {
  public static buildMasterPrompt(topic: string, tone = 'professional'): string {
    return `Generate a master social media post on topic "${topic}" with a ${tone} tone.`;
  }
}
