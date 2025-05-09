import React, { useEffect, useState } from 'react';
import './styles.css';


const circles = [
  { color: 'yellow', label: 'Sinal de Entrada' },
  { color: 'blue', label: 'Sinal de Saída' }
];


// eslint-disable-next-line import/no-anonymous-default-export
export default ({selectedFile, setSelectedFile, selectionEnabled}) => {
  const [projects, setProjects] = useState([]);

  const onDragStart = (event, nodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  function handleListProjects(event) {
    setProjects(event.detail);
  }

  useEffect(() => {
    fetch(process.env.REACT_APP_GET_PROJECTS)
    .then(response => response.json()) 
    .then(data => { 
      if (data.status === 0){
        setProjects(data.projects); 
      }
    })

    window.addEventListener('listProjects', handleListProjects);

    return () => {
      window.removeEventListener('listProjects', handleListProjects);
    };
  }, []);



  const handleItemClick = (fileName) => {
    const event = new CustomEvent('loadProject', {detail: fileName});
    window.dispatchEvent(event);
    setSelectedFile(fileName)
  };

  return (
    <aside>
      <div className="description">Arraste o dispositivo desejado para a esquerda.</div>

      <div className="dndgrid">
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

      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'andor')} draggable>
        and/or
      </div>

      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'switch')} draggable>
        switch
      </div>

      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'equation')} draggable>
        Equation
      </div>

      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'valueof')} draggable>
        Value of
      </div>

      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'end')} draggable>
        end
      </div>

      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Proporcional')} draggable>
        Proporcional
      </div>

      <div className="dndnode" onDragStart={(event) => onDragStart(event, 'Derivative')} draggable>
        Derivative
      </div>
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
            <li 
              className={`file-item ${selectedFile === file ? 'selected' : ''}`}
              key={index} 
              onClick={selectionEnabled ? () => handleItemClick(file) : null}
              style={{ pointerEvents: selectionEnabled ? 'auto' : 'none' }}              
            >
                {file}
            </li>
          ))}
        </ul>
      </div>    
    </aside>
  );
};
