import { memo } from 'react';
import { Position, NodeProps, Handle, Node } from '@xyflow/react';
import './index.css';

function StartNode({ id, data }: NodeProps<Node<{ text: string }>>) {

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
    <div>Start</div>
     <Handle id="out" type="source" position={Position.Right} style={{backgroundColor: 'blue'}}/>
    </div>
  );
}

export default memo(StartNode);


