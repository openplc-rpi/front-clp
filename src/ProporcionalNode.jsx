import React, { useEffect } from 'react';
import { memo } from 'react';
import { Position, NodeProps, Handle, Node, useReactFlow } from '@xyflow/react';
import './index.css';

function ProporcionalNode({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();

  // Garante que a propriedade "text" exista no data (inicializa com vazio, se não existir)
  useEffect(() => {
    if (!('text' in data)) {
      updateNodeData(id, { text: '' });
    }
  }, [id, data, updateNodeData]);

  return (
    <div
      style={{
        borderRadius: '10%',
        backgroundColor: '#fff',
        width: 90,
        height: 30,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#eee',
        color: '#222',
        padding: 10,
        fontSize: 8,
        border: '1px solid #000',
      }}
    >
      <div><center>Proportional</center></div>
      <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: 10 }}>kp :</span>
        <input
          onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
          value={data.text || ''}
          style={{ width: 40, fontSize: 10 }}
        />
      </div>
      <Handle id="P_in" type="target" position={Position.Left} style={{ backgroundColor: 'yellow' }} />
      <Handle id="P_out" type="source" position={Position.Right} style={{ backgroundColor: 'blue' }} />
    </div>
  );
}

export default memo(ProporcionalNode);
