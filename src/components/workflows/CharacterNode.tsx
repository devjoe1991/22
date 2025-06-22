import { Handle, Position, NodeProps } from 'reactflow';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

// This defines the expected data structure for our custom node
export type CharacterNodeData = {
  label: string;
  characterId?: string; // Optional: To link to a character in the future
};

export function CharacterNode({ data }: NodeProps<CharacterNodeData>) {
  return (
    <Card className="border-2 border-purple-500 shadow-lg">
      <CardHeader className="p-2 text-center">
        <CardTitle className="text-sm">{data.label}</CardTitle>
      </CardHeader>
      <Handle type="target" position={Position.Top} className="w-16 !bg-purple-500" />
      <Handle type="source" position={Position.Bottom} className="w-16 !bg-purple-500" />
    </Card>
  );
} 