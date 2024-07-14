import { memo } from 'react';
import { Position, NodeProps, Handle, useReactFlow, Node } from '@xyflow/react';

function StartNode({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();

  return (
    <div
      style={{
        borderRadius: '100%',
        backgroundColor: '#fff',
        width: 30,
        height: 30,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eee',
        color: '#222',
        padding: 10,
        fontSize: 12,
      }}
    >
    <div>Start</div>
     <Handle type="source" position={Position.Right} />
    </div>
  );
}

export default memo(StartNode);


