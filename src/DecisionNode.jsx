import { memo } from 'react';
import { Position, NodeProps, Handle, useReactFlow, Node } from '@xyflow/react';

function DecisionNode({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();

  return (
    <div
      style={{
        background: '#eee',
        color: '#222',
        padding: 10,
        fontSize: 8,
        borderRadius: '10%',
        width: 50,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
    <div>Decision</div>
     <Handle type="target" position={Position.Left}/>
     <div style={{ marginTop: 5 }}>
        <input
          onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
          value={data.text}
          style={{ display: 'block', width: 30, fontSize: 8 }}
        />
        <Handle type="source" position={Position.Right} />        
      </div>
    </div>
  );
}

export default memo(DecisionNode);


