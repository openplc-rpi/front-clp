import React, { useEffect } from 'react';
import { memo } from 'react';
import { Position, NodeProps, Handle, Node, useReactFlow } from '@xyflow/react';
import './index.css';

function PID({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();

  // Garante que as propriedades P, I e D existam no data (inicializa com vazio, se não existir)
  useEffect(() => {
    if (!('P' in data)) {
      updateNodeData(id, { P: '0' });
    }

    if (!('D' in data)) {
      updateNodeData(id, { D: '0' });
    }

    if (!('I' in data)) {
      updateNodeData(id, { I: '0' });
    }

    console.log('PID data:', data);
  }, [id, data, updateNodeData]);

  return (
    <div
      style={{
        borderRadius: '10%',
        backgroundColor: '#fff',
        width: 100,
        height: 90,
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
      <div><center>PID</center></div>
      <div style={{ marginTop: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
        
        <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: 10 }}>kp :</span>
        <input
          onChange={(evt) => updateNodeData(id, { P: evt.target.value })}
          value={data.P || '0'}
          style={{ width: 40, fontSize: 10 }}
        />
        </div>

        <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: 10 }}>kd :</span>
        <input
          onChange={(evt) => updateNodeData(id, { D: evt.target.value })}
          value={data.D || '0'}
          style={{ width: 40, fontSize: 10 }}
        />
        </div>

        <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: '5px' }}>
        <span style={{ fontSize: 10 }}>ki :</span>
        <input
          onChange={(evt) => updateNodeData(id, { I: evt.target.value })}
          value={data.I || '0'}
          style={{ width: 40, fontSize: 10 }}
        />
        </div>
      </div>
      <Handle id="D_in" type="target" position={Position.Left} style={{ backgroundColor: 'yellow' }} />
      <Handle id="D_out" type="source" position={Position.Right} style={{ backgroundColor: 'blue' }} />
    </div>
  );
}

export default memo(PID);
