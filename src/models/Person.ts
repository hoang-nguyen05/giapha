export type PersonType = 'main' | 'blue' | 'green' | 'red' | 'gold';

export interface Person {
  id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  generation: number;
  type: PersonType;
  birthYear: string | null;
  deathYear: string | null;
  note: string;
  position?: { x: number; y: number }; // For manual layout mode
}
