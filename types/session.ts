export type TestType = 'passive' | 'active' | 'regularity';

export interface SessionBlock {
  id: string;
  type: TestType;
  order: number;
}

export interface Session {
  id: string;
  name: string;
  createdAt: number;
  blocks: SessionBlock[];
}
