export class PromptMemory {
  private static prompts: string[] = [];

  static remember(prompt: string): void {
    if (this.prompts.length > 50) this.prompts.shift();
    this.prompts.push(prompt);
  }

  static getRecent(): string[] {
    return [...this.prompts];
  }
}
