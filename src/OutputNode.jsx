import { memo, useEffect, useState } from 'react';
import { Position, NodeProps, Handle, useReactFlow, Node } from '@xyflow/react';

function OutputNode({ id, data }: NodeProps<Node<{ text: string }>>) {
  const { updateNodeData } = useReactFlow();
  const [IoPorts, setIoPorts] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVER_ADDR+process.env.REACT_APP_GET_PORTS)
    .then(response => response.json()) 
    .then(data => {setIoPorts(data);})
  }, []);

  
  var options = ""
  if ( IoPorts.length == 0 ) {
    return;
  } else {
    options = IoPorts.out_ports.map((port) => (
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
      }}
    >
      <div><center>outPort</center></div>
      <center>
        <div style={{ marginTop: 5 }}>
        <select value={data.text} id="output_ports" name="output_ports" style={{ display: 'block', width: 50, fontSize: 10 }} onChange={(evt) => updateNodeData(id, { text: evt.target.value })}>
          {options}
        </select>          
        </div>
      </center>
      <Handle type="target" position={Position.Left} style={{ backgroundColor: 'yellow'}}/>
      <Handle type="source" position={Position.Right} style={{ backgroundColor: 'blue'}}/>
    </div>
  );
}

export default memo(OutputNode);