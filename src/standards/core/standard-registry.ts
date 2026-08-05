import { StandardDefinition } from './standard-definition';

class StandardsRegistry {
  private standards: Map<string, StandardDefinition> = new Map();

  public register(std: StandardDefinition): void {
    if (this.standards.has(std.id)) {
      console.warn(`[StandardsRegistry] Overwriting existing standard with ID: ${std.id}`);
    }
    this.standards.set(std.id, std);
  }

  public registerBatch(stds: StandardDefinition[]): void {
    stds.forEach((s) => this.register(s));
  }

  public getById(id: string): StandardDefinition | undefined {
    return this.standards.get(id);
  }

  public getBySlug(slug: string): StandardDefinition | undefined {
    return Array.from(this.standards.values()).find((s) => s.slug === slug);
  }

  public getAll(): StandardDefinition[] {
    return Array.from(this.standards.values());
  }

  public getPublic(): StandardDefinition[] {
    return this.getAll().filter((s) => s.isPublic);
  }

  public getByCategory(category: string): StandardDefinition[] {
    return this.getAll().filter((s) => s.category === category);
  }
}

export const standardsRegistry = new StandardsRegistry();
