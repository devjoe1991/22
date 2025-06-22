'use client';

import React, { useEffect, useMemo } from 'react';
import ReactFlow, { Background, Controls, MiniMap } from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '@/lib/store/workflow-store';
import { Button } from '@/components/ui/button';
import { Save, UserPlus } from 'lucide-react';
import { CharacterNode } from './CharacterNode';

// Assuming the workflow prop has a `state` field which is JSON
type WorkflowCanvasProps = {
  workflow: {
    id: string;
    name: string;
    state: any;
  };
};

export function WorkflowCanvas({ workflow }: WorkflowCanvasProps) {
  // Get state and actions from the Zustand store
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, setNodes, setEdges, setWorkflowId, addNode, handleSave } = useWorkflowStore();

  // Define custom node types
  const nodeTypes = useMemo(() => ({ character: CharacterNode }), []);

  // Initialize the store with data from the database on component mount
  useEffect(() => {
    if (workflow && workflow.state) {
      setNodes(workflow.state.nodes || []);
      setEdges(workflow.state.edges || []);
    }
    setWorkflowId(workflow.id);
  }, [workflow, setNodes, setEdges, setWorkflowId]);
  
  const onAddCharacterNode = () => {
    const newNodeId = `character_${nodes.length + 1}`;
    const newNode = {
      id: newNodeId,
      type: 'character',
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: 'New Character Node' },
    };
    addNode(newNode);
  };

  return (
    <div className="w-full h-[calc(100vh-120px)] relative">
      <div className="absolute top-2 right-2 z-10 space-x-2">
        <Button size="sm" onClick={onAddCharacterNode} variant="outline">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Character
        </Button>
        <Button size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Workflow
        </Button>
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
} 