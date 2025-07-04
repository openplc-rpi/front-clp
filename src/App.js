import React, { useRef, useState, useCallback, useEffect } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Panel,
  MarkerType,
  useOnSelectionChange,
} from '@xyflow/react';
import { io } from 'socket.io-client';




import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';
import InputNode from './InputNode';
import StartNode from './StartNode';
import DecisionNode from './DecisionNode';
import Operation from './Operation';
import OutputNode from './OutputNode';
import EndNode from './EndNode';
import AndOr from './AndOr';
import Switch from './Switch';
import Equation from './Equation';
import ValueOf from './ValueOf';
import PID from './PIDNode';
import ReferenceValue from './ReferenceValue';
import GraphNode from './GraphNode';
import './index.css';

const nodeTypes = {
  inport: InputNode,
  start: StartNode,
  decision: DecisionNode,
  operation: Operation,
  outport: OutputNode,
  end: EndNode,
  andor: AndOr,
  switch: Switch,
  equation: Equation,
  valueof: ValueOf,
  pid: PID, 
  graph:GraphNode,
  reference: ReferenceValue,
};

let id = 0;
const getId = () => `dndnode_${id++}`;



const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [selectedEdges, setSelectedEdges] = useState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport, getNodes, deleteElements, screenToFlowPosition } = useReactFlow();
  const [error, setError] = useState("");
  const [socket, setSocket] = useState(null);
    const [selectedFile, setSelectedFile] = useState('');
  const [state, setState] = useState('start');  
  const [selectionEnabled, setSelectionEnabled] = useState(true);

  useEffect(() => {
    const socket = io(process.env.REACT_APP_SOCKETIO_URL, {});
    window.socket = socket;    // ← exponha aqui
    
    socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    socket.on('update', (data) => {
      setEdges((eds) =>
        eds.map((edge) => {
          const currentNodes = getNodes();

          const targetNode = currentNodes.find((node) => node.id === edge.target);

          if (targetNode && targetNode.type === 'end') {
            return { ...edge, label: '' };
          }

          const match = data.find(([edgePair]) =>
            edge.source === edgePair[0] && edge.target === edgePair[1]
          );
  
          return match
            ? { ...edge, label: match[1] !== null ? match[1].toString() : '' }
            : edge;
        })
      );      

    });

    socket.on('error', (errMsg) => {
      console.error('WebSocket error:', errMsg);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
    });

    setSocket(socket);

    return () => {
      socket.disconnect();
    };
  }, []);

  /*  Function to trigger an error.*/
  const triggerError = (error_msg) => {
    setError(error_msg);
    setTimeout(() => {
      setError("");
    }, 10000); // Fade out after 5 seconds
  };


  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
    [setEdges],
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();

      const fileName = window.prompt('Nome do arquivo (.flow):', selectedFile != '' ? selectedFile : 'untilted.flow');

      if (fileName === null) {
        return;
      }

      setSelectedFile(fileName);

      const options = {
        method: 'POST',
        headers: { 
          'Content-type': 'application/json' 
        },
        'body': JSON.stringify({ 'project_name': fileName, 'flowchart': flow })
      };

      fetch(process.env.REACT_APP_GET_PROJECTS, options)
        .then(response => response.json())
        .then(data => {
          const event = new CustomEvent('listProjects', {detail: data.projects});
          window.dispatchEvent(event);
        });
    }
  });

  const onRun = useCallback(() => {
    if (state === 'start') {
      setState('stop');
      setSelectionEnabled(false);
    }
    else {
      setState('start');
      setSelectionEnabled(true);
    }
    const options = {
      method: 'PUT',
      headers: { 
        'Content-type': 'application/json' 
      },
      'body': JSON.stringify({ 'state': state, 'filename': selectedFile })
    };

    fetch(process.env.REACT_APP_GET_START, options)
      .then(response => response.json())
      .then(data => {
        console.log(data);
      });
  })

    
  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
    id = 0;

    setSelectedFile('');
  }, [setEdges, setNodes]);

  const onDelete = useCallback(() => {
    deleteElements({ nodes: selectedNodes });
    deleteElements( { edges: selectedEdges });
  }, [deleteElements, selectedNodes, selectedEdges]);

  const onDragOver = useCallback((event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');

      // check if the dropped element is valid
      if (typeof type === 'undefined' || !type) {
        return;
      }

      /* check if the dropped element is already in the graph.
         It is allowed only one start and one end nodes
      */
      var flag = false;
      getNodes().forEach(n => {
        if (n.type === type &&  (type === 'start' || type === 'end')) {
          flag = true;
        }
      })

      if (flag) {
        return;
      }
      
      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10     
      const position = screenToFlowPosition({ 
        x: event.clientX, 
        y: event.clientY,
      });

      var newNode = {
        id: getId(),
        type,
        position,
        data: { label: `${type}` },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition, setNodes, getNodes],
  );

  const onChange = useCallback(({ nodes, edges }) => {
    setSelectedNodes(nodes);    
    setSelectedEdges(edges);
  }, []);

  useOnSelectionChange({
     onChange,
    });

  useEffect(() => {
    const handleUpdateEditorView = (event) => {

      const params = new URLSearchParams({ 
        project_name: event.detail,
      });

      fetch(process.env.REACT_APP_GET_PROJECTS+'?'+ params)
        .then(response => response.json())
        .then(data => {
          if (data.status === 0) {
            const { x = 0, y = 0, zoom = 1 } = data.flowchart.viewport;
            setNodes(data.flowchart.nodes || []);
            setEdges(data.flowchart.edges || []);
            setViewport({ x, y, zoom });
            id = data.flowchart.nodes.length;
          }else{
            triggerError(data.error_description);
          }
        }
      );    
    };

    window.addEventListener('loadProject', handleUpdateEditorView);

    return () => {
      window.removeEventListener('loadProject', handleUpdateEditorView);
    };
  }, [setEdges, setNodes, setViewport]);


  return (
    <div className="dndflow">
      {error !== "" && (
        <div className="error-bar">
          {error}
        </div>
      )}
      <div className="reactflow-wrapper" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onInit={setRfInstance}
          nodeTypes={nodeTypes}
          fitView
        >
          <Controls />
          <Panel position="top-right">
            <button style={{ marginRight: '10px' }} onClick={onDelete} disabled={!selectionEnabled}>delete</button>
            <button onClick={onClear} disabled={!selectionEnabled}>clear</button>
            <button style={{ marginRight: '10px' }} onClick={onSave} disabled={!selectionEnabled}>save</button>
            <button onClick={onRun} style={{ backgroundColor: state !== 'start' ? 'red' : 'green' }}>{state}</button>


          </Panel>
        </ReactFlow>
      </div>
      <Sidebar selectedFile={selectedFile} setSelectedFile={setSelectedFile} selectionEnabled={selectionEnabled}/>
    </div>
  );
};

// eslint-disable-next-line import/no-anonymous-default-export
export default () => (
  <ReactFlowProvider>
    <DnDFlow />
  </ReactFlowProvider>
);
