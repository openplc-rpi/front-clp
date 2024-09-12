import React from 'react';
import './styles.css';
import {
  Panel,
} from '@xyflow/react';


  const circles = [
    { color: 'yellow', label: 'Sinal de Entrada' },
    { color: 'blue', label: 'Sinal de Saída' },
    { color: 'green', label: 'Ativo se Verdadeiro' },
    { color: 'red', label: 'Ativo se Falso' }
  ];




export default () => {
  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };


  return (
    <aside>
      <div className="description">Arraste o dispositivo desejado para a esquerda.</div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'start')} draggable>
        Start
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'inport')} draggable>
        inPort
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'decision')} draggable>
        Decision
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'operation')} draggable>
        Operation
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'outport')} draggable>
      out-port
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'end')} draggable>
        end
      </div>
      <div className="square">
        <h3 className="title">Legenda</h3>
        <div className="circle-grid">
          {circles.map((circle, index) => (
            <div key={index} className="circle-container">
              <div
                className="circle"
                style={{ backgroundColor: circle.color }}
              ></div>
              <span className="label">{circle.label}</span>
            </div>
          ))}
      </div>      
    </div>
  </aside>
  );
};
