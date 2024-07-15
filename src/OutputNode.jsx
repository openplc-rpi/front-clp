import { memo } from 'react';
import { Position, NodeProps, Handle, useReactFlow, Node } from '@xyflow/react';

function OutputNode({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();

  return (
    <div
      style={{
        background: '#eee',
        color: '#222',
        padding: 10,
        fontSize: 8,
        borderRadius: '10%',
        width: 80,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div><center>outPort</center></div>
      <center>
        <div style={{ marginTop: 5 }}>
          <input
            onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
            value={data.text}
            style={{ display: 'block', width: 30, fontSize: 8 }}
          />
        </div>
      </center>
      <Handle type="target" position={Position.Left}/>
      <Handle type="source" position={Position.Right}/>
    </div>
  );
}

export default memo(OutputNode);