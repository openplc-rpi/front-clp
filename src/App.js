import React, { useRef, useState, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Position,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
  Panel,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';
import TextNode from './TextNode';
import StartNode from './StartNode';
import DecisionNode from './DecisionNode';
import './index.css';

const nodeTypes = {
  text: TextNode,
  start: StartNode,
  decision: DecisionNode,
};

const flowKey = 'example-flow';
let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge( {...params, animated: true}, eds)),
    [],
  );

  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      localStorage.setItem(flowKey, JSON.stringify(flow));
      console.log(flow)
    }
  }, [rfInstance]);  

  const onRun = useCallback(() => {
    console.log('run');
    const flow = rfInstance.toObject();
    console.log(flow);
  });  

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const { x = 0, y = 0, zoom = 1 } = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
        setViewport({ x, y, zoom });
      }
    };

    restoreFlow();
  }, [setNodes, setViewport]);  

  const onDragOver = useCallback((event) => {
    console.log('drag over');
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

      // project was renamed to screenToFlowPosition
      // and you don't need to subtract the reactFlowBounds.left/top anymore
      // details: https://reactflow.dev/whats-new/2023-11-10
      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      var newNode = {          
        id: getId(),
        position,
        data: { label: `${type}` },
      };

      if (type == 'start'){
        newNode['type'] = 'start';
      }else if (type == 'in-portA'){
        newNode['type'] = 'selectorNode';
      }else if (type == 'decision'){
        newNode['type'] = 'decision';
        newNode['data'] = { text: '> 1.2v' };
      }else if (type == 'end'){
        newNode['type'] = 'output';
        newNode['style'] = {
            borderRadius: '100%',
            backgroundColor: '#eee',
            color: '#222',
            padding: 10,
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 12,
          };
        newNode['sourcePosition'] = Position.Top;
      }

        

      console.log(newNode);

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition],
  );

  return (
    <div className="dndflow">
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
            <button onClick={onSave}>save</button>
            <button onClick={onRestore}>restore</button>
            <button onClick={onRun}>run</button>
          </Panel>          
        </ReactFlow>
      </div>
      <Sidebar />
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <DnDFlow />
  </ReactFlowProvider>
);
