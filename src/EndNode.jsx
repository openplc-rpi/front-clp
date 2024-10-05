import { memo } from 'react';
import { Position, NodeProps, Handle, Node } from '@xyflow/react';

function EndNode({ id, data }: NodeProps<Node<{ text: string }>>) {

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
        border: '1px solid #000',
      }}
    >
    <div>End</div>
     <Handle id="in" type="target" position={Position.Left} style={{ backgroundColor: 'yellow'}}/>
    </div>
  );
}

export default memo(EndNode);


