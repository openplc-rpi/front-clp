import React, { useEffect } from 'react';
import { memo } from 'react';
import { Position, NodeProps, Handle, useReactFlow, Node } from '@xyflow/react';

function Switch({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();

  return (
    <div
      style={{
        background: '#eee',
        color: '#222',
        padding: 10,
        fontSize: 8,
        borderRadius: '10%',
        width: 90,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid #000',
      }}
    >
      <div><center>Switch</center></div>
      <Handle id="sin1" type="target" position={Position.Left} style={{ top:10, backgroundColor: 'yellow'}}>v</Handle>
      <Handle id="sin2" type="target" position={Position.Left}  style={{ bottom: 5, top: 'auto', backgroundColor: 'yellow'}}>s</Handle>
      <Handle id="output" type="source" position={Position.Right} style={{backgroundColor: 'red'}}/>
    </div>
  );
}

export default memo(Switch);


