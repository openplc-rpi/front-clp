import React from 'react';
import {
  Panel,
} from '@xyflow/react';

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
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'in-portA')} draggable>
        in-portA
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'decision')} draggable>
        Decision
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'out-portB')} draggable>
      out-portB
      </div>
      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'end')} draggable>
        end
      </div>
    </aside>
  );
};
