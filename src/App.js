import React, { useRef, useCallback } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  addEdge,
  Position,
  useNodesState,
  useEdgesState,
  Controls,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import Sidebar from './Sidebar';

import './index.css';

let id = 0;
const getId = () => `dndnode_${id++}`;

const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge( {...params, animated: true}, eds)),
    [],
  );

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
        type,
        position,
        data: { label: `${type}` },
      };

      if (type == 'start'){
        newNode['type'] = 'input';
        newNode['style'] = {
            borderRadius: '100%',
            backgroundColor: '#fff',
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          };
        newNode['sourcePosition'] = Position.Bottom;
      }else if (type == 'in-portA'){
        newNode['type'] = 'selectorNode';
        //newNode['sourcePosition'] = Position.Left;
      }else if (type == 'end'){
        newNode['type'] = 'output';
        newNode['style'] = {
            borderRadius: '100%',
            backgroundColor: '#fff',
            width: 50,
            height: 50,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
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
          fitView
        >
          <Controls />
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
