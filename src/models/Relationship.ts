export type RelationshipType = 'parent-child' | 'spouse' | 'sibling';

export interface Relationship {
  id: string;
  type: RelationshipType;
  sourceId: string; // e.g., parentId
  targetId: string; // e.g., childId
}
