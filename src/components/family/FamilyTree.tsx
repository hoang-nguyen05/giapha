import { useEffect, useRef, useCallback, useState } from 'react';
import ReactFlow, {
  MiniMap,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type NodeChange,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { useFamilyStore } from '../../store/familyStore';
import { useUIStore } from '../../store/uiStore';
import { getLayoutedElements } from '../../utils/treeLayout';
import FamilyNode from './FamilyNode';
import PosterNode from './PosterNode';
import ContextMenu from '../editor/ContextMenu';
import CanvasDock from '../common/CanvasDock';

const nodeTypes = { familyNode: FamilyNode, posterNode: PosterNode };

function FamilyTreeInner() {
  const { people, relationships, layoutMode, savePosition, settings } = useFamilyStore();
  const { setContextMenu, setHighlightedPersonId } = useUIStore();
  const { fitBounds } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [showMiniMap, setShowMiniMap] = useState(true);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
      people, 
      relationships, 
      layoutMode, 
      settings.edgeStyle || 'step'
    );

    const styledEdges = layoutedEdges.map(e => ({
      ...e,
      style: { 
        stroke: '#7A241A', 
        strokeWidth: 2, 
        strokeLinecap: 'round' as const,
        transition: 'stroke 0.2s, stroke-width 0.2s',
      },
      markerEnd: undefined, 
    }));

    setNodes(layoutedNodes);
    setEdges(styledEdges);

    // Initial center on the Poster
    setTimeout(() => {
      fitBounds({ x: 0, y: 0, width: 1600, height: 2400 }, { padding: 0.08, duration: 800 });
    }, 120);
  }, [people, relationships, layoutMode, settings.edgeStyle, setNodes, setEdges, fitBounds]);

  const handleNodesChange = useCallback((changes: NodeChange[]) => {
    // Prevent moving the poster node
    const filteredChanges = changes.filter(c => !(c.type === 'position' && c.id === 'poster'));
    onNodesChange(filteredChanges);

    if (layoutMode === 'manual') {
      filteredChanges.forEach((change) => {
        if (change.type === 'position' && change.dragging === false && change.position && change.id !== 'poster') {
          savePosition(change.id, change.position);
        }
      });
    }
  }, [layoutMode, onNodesChange, savePosition]);

  const onNodeContextMenu = useCallback(
    (event: React.MouseEvent, node: Node) => {
      event.preventDefault();
      if (node.id === 'poster') return;
      setContextMenu({ x: event.clientX, y: event.clientY, personId: node.id });
    },
    [setContextMenu]
  );

  const onPaneClick = useCallback(() => {
    setContextMenu(null);
    setHighlightedPersonId(null);
  }, [setContextMenu, setHighlightedPersonId]);

  const handleEdgesDelete = useCallback((edgesToDelete: Edge[]) => {
    edgesToDelete.forEach((edge) => {
      useFamilyStore.getState().removeRelationship(edge.id);
    });
  }, []);

  const handleNodesDelete = useCallback((nodesToDelete: Node[]) => {
    nodesToDelete.forEach((node) => {
      if (node.id !== 'poster') {
        useFamilyStore.getState().removePerson(node.id);
      }
    });
  }, []);

  const handleConnect = useCallback((params: any) => {
    if (params.source && params.target && params.source !== params.target) {
      useFamilyStore.getState().addRelationship({
        sourceId: params.source,
        targetId: params.target,
        type: 'parent-child'
      });
    }
  }, []);

  return (
    <div
      ref={reactFlowWrapper}
      id="family-tree-export-container"
      style={{ 
        width: '100vw', 
        height: '100vh', 
        position: 'relative', 
        overflow: 'hidden', 
        background: 'transparent' 
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onEdgesDelete={handleEdgesDelete}
        onNodesDelete={handleNodesDelete}
        onConnect={handleConnect}
        onNodeContextMenu={onNodeContextMenu}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        minZoom={0.04}
        maxZoom={3.5}
        nodesDraggable={layoutMode === 'manual'}
        proOptions={{ hideAttribution: true }}
        style={{ background: 'transparent' }}
      >
        {showMiniMap && (
          <MiniMap
            nodeColor={(node) => {
              if (node.id === 'poster') return '#e8d4a9';
              const t = node.data?.person?.type;
              if (t === 'main') return '#B8860B';
              if (t === 'blue') return '#4A90E2';
              if (t === 'green') return '#48BB78';
              if (t === 'red') return '#E53E3E';
              if (t === 'gold') return '#ECC94B';
              return '#B8860B';
            }}
            maskColor="rgba(38, 28, 20, 0.25)"
            style={{ 
              bottom: 24, 
              right: 24, 
              width: 140, 
              height: 210, 
              border: '1.5px solid #C49B38',
              borderRadius: '12px',
              boxShadow: '0 10px 28px rgba(43, 35, 27, 0.2)'
            }}
          />
        )}
      </ReactFlow>

      {/* Floating Canvas Dock Controls */}
      <CanvasDock showMiniMap={showMiniMap} setShowMiniMap={setShowMiniMap} />

      <ContextMenu />
    </div>
  );
}

export default function FamilyTree() {
  return <FamilyTreeInner />;
}
