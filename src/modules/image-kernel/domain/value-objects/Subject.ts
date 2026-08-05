export interface Subject {
  readonly description: string;
  readonly humanRequired: boolean;
  readonly prominence: 'primary' | 'supporting';
}
