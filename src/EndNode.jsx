import { memo } from 'react';
import { Position, NodeProps, Handle, useReactFlow, Node } from '@xyflow/react';

function EndNode({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();

  return (
    <div
      style={{
        borderRadius: '100%',
        backgroundColor: '#fff',
        width: 40,
        height: 40,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eee',
        color: '#222',
        padding: 10,
        fontSize: 12,
      }}
    >
    <div>End</div>
     <Handle type="target" position={Position.Left} style={{ backgroundColor: 'yellow'}}/>
    </div>
  );
}

export default memo(EndNode);


