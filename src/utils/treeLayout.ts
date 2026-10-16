import dagre from 'dagre';
import type { Node, Edge } from 'reactflow';
import type { Person } from '../models/Person';
import type { Relationship } from '../models/Relationship';
import { POSTER_WIDTH } from '../components/family/PosterNode';

const nodeWidth = 132;
const nodeHeight = 50;
const ROOT_START_Y = 320;

export const getLayoutedElements = (
  people: Person[],
  relationships: Relationship[],
  layoutMode: 'auto' | 'manual',
  edgeStyle: 'step' | 'straight' | 'default' = 'step'
): { nodes: Node[]; edges: Edge[] } => {
  const posterNode: Node = {
    id: 'poster',
    type: 'posterNode',
    position: { x: 0, y: 0 },
    data: {},
    selectable: false,
    draggable: false,
    deletable: false,
    zIndex: -1,
  };

  const nodes: Node[] = people.map((person) => ({
    id: person.id,
    type: 'familyNode',
    data: { person },
    position: person.position || { x: 0, y: 0 },
  }));

  const edges: Edge[] = relationships.map((rel) => ({
    id: rel.id,
    source: rel.sourceId,
    target: rel.targetId,
    type: edgeStyle,
    data: { type: rel.type },
  }));

  if (layoutMode === 'manual') {
    return { nodes: [posterNode, ...nodes], edges };
  }

  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  
  // Reduce spacing to compress the tree so it doesn't bleed out of the poster
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 15, ranksep: 40 });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  // Center alignment logic: Find root node (no incoming edges)
  const targetIds = new Set(edges.map(e => e.target));
  const rootNode = layoutedNodes.find(n => !targetIds.has(n.id)) || layoutedNodes[0];

  if (rootNode) {
    const shiftX = (POSTER_WIDTH / 2) - (nodeWidth / 2) - rootNode.position.x;
    const shiftY = ROOT_START_Y - rootNode.position.y;

    layoutedNodes.forEach(n => {
      n.position.x += shiftX;
      n.position.y += shiftY;
    });
  }

  return { nodes: [posterNode, ...layoutedNodes], edges };
};
