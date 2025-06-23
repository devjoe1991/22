import { create } from 'zustand';
import {
  Connection,
  Edge,
  EdgeChange,
  Node,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
import { saveWorkflow } from '@/components/workflows/actions';

export type RFState = {
  nodes: Node[];
  edges: Edge[];
  workflowId: string | null;
  setWorkflowId: (id: string) => void;
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: OnNodesChange;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  addNode: (node: Node) => void;
  handleSave: () => Promise<void>;
};

export const useWorkflowStore = create<RFState>((set, get) => ({
  nodes: [],
  edges: [],
  workflowId: null,
  setWorkflowId: (id: string) => set({ workflowId: id }),
  setNodes: (nodes: Node[]) => set({ nodes }),
  setEdges: (edges: Edge[]) => set({ edges }),
  onNodesChange: (changes: NodeChange[]) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },
  onEdgesChange: (changes: EdgeChange[]) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },
  onConnect: (connection: Connection) => {
    set({
      edges: addEdge(connection, get().edges),
    });
  },
  addNode: (node: Node) => {
    set({
      nodes: [...get().nodes, node]
    })
  },
  handleSave: async () => {
    const { nodes, edges, workflowId } = get();
    if (!workflowId) {
      // In a real app, you'd show a toast notification here.
      return;
    }
    try {
      await saveWorkflow(workflowId, nodes, edges);
      // Here you could trigger a toast notification for "Saved!"
    } catch (error) {
      // Optionally, set an error state here
    }
  },
})); 