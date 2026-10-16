import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Person } from '../models/Person';
import type { Relationship } from '../models/Relationship';
import { initialPeople, initialRelationships } from '../data/initialFamilyData';
import { v4 as uuidv4 } from 'uuid';

interface FamilySettings {
  title: string;
  subtitle?: string;
  edgeStyle?: 'step' | 'straight' | 'default';
  showPosterBg?: boolean;
}

interface FamilyState {
  people: Person[];
  relationships: Relationship[];
  settings: FamilySettings;
  layoutMode: 'auto' | 'manual';
  
  // Actions
  addPerson: (person: Omit<Person, 'id'>) => Person;
  updatePerson: (id: string, updates: Partial<Person>) => void;
  removePerson: (id: string) => void;
  addRelationship: (relationship: Omit<Relationship, 'id'>) => void;
  removeRelationship: (id: string) => void;
  updateSettings: (settings: Partial<FamilySettings>) => void;
  setLayoutMode: (mode: 'auto' | 'manual') => void;
  savePosition: (id: string, position: { x: number; y: number }) => void;
  initializePositions: (nodes: { id: string; position: { x: number; y: number } }[]) => void;
  forceInitializePositions: (nodes: { id: string; position: { x: number; y: number } }[]) => void;
  resetToDemo: () => void;
  importData: (data: { people: Person[]; relationships: Relationship[]; settings?: FamilySettings }) => void;
}

export const useFamilyStore = create<FamilyState>()(
  persist(
    (set) => ({
      people: initialPeople,
      relationships: initialRelationships,
      settings: {
        title: 'SƠ ĐỒ GIA PHẢ HỌ NGUYỄN ĐẮC',
      },
      layoutMode: 'auto',

      addPerson: (person) => {
        const newPerson = { ...person, id: uuidv4() };
        set((state) => ({ people: [...state.people, newPerson] }));
        return newPerson;
      },

      updatePerson: (id, updates) => {
        set((state) => ({
          people: state.people.map((p) => (p.id === id ? { ...p, ...updates } : p)),
        }));
      },

      removePerson: (id) => {
        set((state) => ({
          people: state.people.filter((p) => p.id !== id),
          relationships: state.relationships.filter(
            (r) => r.sourceId !== id && r.targetId !== id
          ),
        }));
      },

      addRelationship: (relationship) => {
        set((state) => ({
          relationships: [...state.relationships, { ...relationship, id: uuidv4() }],
        }));
      },

      removeRelationship: (id) => {
        set((state) => ({
          relationships: state.relationships.filter((r) => r.id !== id),
        }));
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));
      },

      setLayoutMode: (mode) => {
        set({ layoutMode: mode });
      },

      savePosition: (id, position) => {
        set((state) => ({
          people: state.people.map((p) =>
            p.id === id ? { ...p, position } : p
          ),
        }));
      },

      initializePositions: (nodes) => {
        set((state) => {
          const positionMap = new Map(nodes.map(n => [n.id, n.position]));
          return {
            people: state.people.map(p => {
              const pos = positionMap.get(p.id);
              // Only overwrite if person doesn't have a custom position yet
              const isDefaultPosition = !p.position || (p.position.x === 0 && p.position.y === 0);
              
              if (pos && isDefaultPosition) {
                return { ...p, position: pos };
              }
              return p;
            })
          };
        });
      },

      forceInitializePositions: (nodes) => {
        set((state) => {
          const positionMap = new Map(nodes.map(n => [n.id, n.position]));
          return {
            people: state.people.map(p => {
              const pos = positionMap.get(p.id);
              if (pos) {
                return { ...p, position: pos };
              }
              return p;
            })
          };
        });
      },

      resetToDemo: () => {
        set({
          people: initialPeople,
          relationships: initialRelationships,
          settings: { title: 'SƠ ĐỒ GIA PHẢ HỌ NGUYỄN ĐẮC' },
          layoutMode: 'auto',
        });
      },

      importData: (data) => {
        set({
          people: data.people || [],
          relationships: data.relationships || [],
          settings: data.settings || { title: 'GIA PHẢ' },
        });
      },
    }),
    {
      name: 'family-tree-storage',
    }
  )
);
