'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  NodeTypes,
} from 'reactflow';
import CustomNode from './custom-node';
import { Button } from '@/components/ui/button';
import { saveWorkflow } from './actions';
import { toast } from 'sonner';

const nodeTypes: NodeTypes = {
  custom: CustomNode,
};

interface WorkflowCanvasProps {
  workflowId: string;
  initialNodes: Node[];
  initialEdges: Edge[];
}

export default function WorkflowCanvas({ workflowId, initialNodes, initialEdges }: WorkflowCanvasProps) {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange: OnEdgesChange = useCallback(
    (changes) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const handleSave = async () => {
    const toastId = toast.loading('Saving workflow...');
    try {
      await saveWorkflow(workflowId, nodes, edges);
      toast.success('Workflow saved successfully!', { id: toastId });
    } catch (error: any) {
      toast.error(`Failed to save: ${error.message}`, { id: toastId });
    }
  };

  return (
    <div style={{ width: '100%', height: '75vh' }} className="rounded-lg border bg-muted">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
      >
        <div className="absolute top-4 right-4 z-10">
          <Button onClick={handleSave}>Save Workflow</Button>
        </div>
      </ReactFlow>
    </div>
  );
} 