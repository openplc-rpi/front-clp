import { memo } from 'react';
import { Position, NodeProps, Handle, useReactFlow, Node } from '@xyflow/react';

function AndOr({ id, data }: NodeProps<Node<{ text: string }>>) {
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
      <div><center>Logic</center></div>
      <center>
        <div style={{ marginTop: 5, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <select id="logic_operation" value={data.signal || "and"} name="logic_operation" style={{ display: 'block', width: 40, fontSize: 10 }} onChange={(evt) => updateNodeData(id, { signal: evt.target.value })}>
            <option value="and">and</option>
            <option value="or">or</option>
          </select>             
        </div>
      </center>
      <Handle id="in1" type="target" position={Position.Left} style={{ top:10, backgroundColor: 'yellow'}}/>
      <Handle id="in2" type="target" position={Position.Left}  style={{ bottom: 5, top: 'auto', backgroundColor: 'yellow'}}/>
      <Handle id="output" type="source" position={Position.Right} style={{backgroundColor: 'red'}}/>
    </div>
  );
}

export default memo(AndOr);


