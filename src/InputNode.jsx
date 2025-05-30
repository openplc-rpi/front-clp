import { memo, useEffect, useState } from 'react';
import { Position, NodeProps, Handle, useReactFlow, Node } from '@xyflow/react';
import { use } from 'react';


function InputNode({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();
  const [IoPorts, setIoPorts] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_GET_PORTS)
    .then(response => response.json()) 
    .then(data => {setIoPorts(data);})
  }, []);

  useEffect(() => { 
    console.log(IoPorts, data);

    if (!data.text && IoPorts?.in_ports?.length > 0) {
      updateNodeData(id, { text: IoPorts.in_ports[0] });
    }
  }, [IoPorts, id]);

  
  var options = ""
  if ( IoPorts.length === 0 ) {
    return;
  } else {
    options = IoPorts.in_ports.map((port) => (
        <option  value={port} key={port}>{port}</option>
    ));
  }

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
        border: '1px solid #000',
      }}
    >
      <div><center>inPort</center></div>
      <center>
        <div style={{ marginTop: 5 }}>
        <select value={data.text} id="input_ports" name="input_ports" style={{ display: 'block', width: 50, fontSize: 10 }} onChange={(evt) => updateNodeData(id, { text: evt.target.value })}>
          {options}
        </select>          
        </div>
      </center>
      <Handle id="in" type="target" position={Position.Left} style={{ backgroundColor: 'yellow'}}/>
      <Handle id="out" type="source" position={Position.Right} style={{ backgroundColor: 'blue'}}/>
    </div>
  );
}

export default memo(InputNode);