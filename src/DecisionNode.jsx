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
        width: 90,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div><center>Decision</center></div>
      <center>
        <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select id="compare_signal" value={data.signal} name="compare_signal" style={{ display: 'block', width: 40, fontSize: 10 }} onChange={(evt) => updateNodeData(id, { signal: evt.target.value })}>
            <option value="==">==</option>
            <option value="!=">!=</option>
            <option value=">">&gt;</option>
            <option value="<">&lt;</option>
            <option value=">=">&gt;=</option>
            <option value="<=">&lt;=</option>
          </select>             
          <input
            onChange={(evt) => updateNodeData(id, { text: evt.target.value })}
            value={data.text}
            style={{ display: 'block', width: 30, fontSize: 8 }}
          />
        </div>
      </center>
      <Handle type="target" position={Position.Left} style={{ backgroundColor: 'yellow'}}/>
      <Handle id="true" type="source" position={Position.Right}  style={{ top: 10, backgroundColor: 'green'}}/>
      <Handle id="false" type="source" position={Position.Right} style={{ bottom: 5, top: 'auto', backgroundColor: 'red'}}/>
    </div>
  );
}

export default memo(DecisionNode);


