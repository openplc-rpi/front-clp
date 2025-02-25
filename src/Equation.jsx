import React, { useEffect } from 'react';
import { memo } from 'react';
import { Position, NodeProps, Handle, useReactFlow, Node } from '@xyflow/react';


function Equation({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();

  useEffect(() => {
    if (!('text' in data)) {
      updateNodeData(id, { text: "{x}" });
    }
  }, [data, id]);  

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
      <div><center>Equation</center></div>
      <center>
        <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
            value={data.text || ''}
            style={{ display: 'block', width: 83, fontSize: 8 }}
          />
        </div>
      </center>
      <Handle in="in" type="target" position={Position.Left} style={{ backgroundColor: 'yellow'}}/>
      <Handle id="out" type="source" position={Position.Right} style={{ backgroundColor: 'blue'}}/>
    </div>
  );
}

export default memo(Equation);


