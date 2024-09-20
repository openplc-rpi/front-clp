import React, { useEffect, useState } from 'react';
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
  const [projects, setProjects] = useState([]);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  useEffect(() => {
    fetch(process.env.REACT_APP_SERVER_ADDR+process.env.REACT_APP_GET_PROJECTS)
    .then(response => response.json()) 
    .then(data => { 
      if (data.status == 0){
        setProjects(data.projects); 
      }
    })
  }, []);



  const handleItemClick = (fileName) => {
    const event = new CustomEvent('loadProject', {detail: fileName});
    window.dispatchEvent(event);
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

      <div className="listview">
        <h3 className="title">Projetos</h3>
        <ul className="file-list">
          {projects.map((file, index) => (
            <li key={index} className='file-item' onClick={() => handleItemClick(file)}>{file}</li>
          ))}
        </ul>
      </div>    
    </aside>
  );
};
