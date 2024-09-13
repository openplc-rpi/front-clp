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
  MarkerType,
  useOnSelectionChange,
  } from '@xyflow/react';

  


import '@xyflow/react/dist/style.css';
import Sidebar from './Sidebar';
import InputNode from './InputNode';
import StartNode from './StartNode';
import DecisionNode from './DecisionNode';
import Operation from './Operation';
import OutputNode from './OutputNode';
import EndNode from './EndNode';
import './index.css';

const nodeTypes = {
  inport: InputNode,
  start: StartNode,
  decision: DecisionNode,
  operation: Operation,
  outport: OutputNode,
  end: EndNode
};

const flowKey = 'example-flow';
let id = 0;
const getId = () => `dndnode_${id++}`;


const DnDFlow = () => {
  const reactFlowWrapper = useRef(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNodes, setSelectedNodes] = useState([]);
  const [rfInstance, setRfInstance] = useState(null);
  const { setViewport, getNodes, deleteElements, screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge({ ...params, animated: true, markerEnd: { type: MarkerType.ArrowClosed } }, eds)),
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

  const onClear = useCallback(() => {
    setNodes([]);
    setEdges([]);
  });

  const onDelete = useCallback(() => {
    deleteElements({ nodes: selectedNodes });
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

      id = flow.nodes.length;
      
    };

    restoreFlow();
  }, [setNodes, setViewport]);

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
         It is allowed only one start and one end node. 
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
    [screenToFlowPosition],
  );

  const onChange = useCallback(({ nodes, edges }) => {
    setSelectedNodes(nodes);    

    //deleteElements({ nodes: [{ id: "1" }] }
    //console.log(nodes.map((node) => node.id));
    //console.log(edges.map((edge) => edge.id));
  }, []);  

  useOnSelectionChange({
    onChange,
  });


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
            <button style={{ marginRight: '10px' }} onClick={onDelete}>delete</button>
            <button onClick={onClear}>clear</button>
            <button onClick={onSave}>save</button>
            <button style={{ marginRight: '10px' }} onClick={onRestore}>restore</button>
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
