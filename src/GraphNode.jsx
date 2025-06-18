import { memo, useEffect, useRef, useState } from 'react';
import {  useReactFlow } from '@xyflow/react';
import Chart from 'chart.js/auto';

function GraphNode({ id }) {
  const { getNodes } = useReactFlow();
  const canvasRef = useRef(null);
  const chartRef = useRef(null);
  const [selectedNode, setSelectedNode] = useState('');
  const maxPoints = 50;

  // Inicializa o gráfico vazio
  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'line',
      data: {
        labels: [],
        datasets: [{
          label: 'Valor',
          data: [],
          borderColor: 'blue',
          tension: 0.1,
          fill: false,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { display: false },
          y: { beginAtZero: true,
          }
        },
        plugins: { legend: { display: false } }
      }
    });
    return () => chartRef.current?.destroy();
  }, []);

  // Atualiza o gráfico quando selectedNode muda e chegam dados
  useEffect(() => {
    const socket = window.socket;
    if (!socket || !chartRef.current) return;

    const handler = (updates) => {
      updates.forEach((item) => {
        const [[source], value] = item;
        if (source === selectedNode) {
          const v = parseFloat(value);
          if (isNaN(v)) return;
          const chart = chartRef.current;
          const ds = chart.data.datasets[0].data;
          const labs = chart.data.labels;
          ds.push(v);
          if (ds.length > maxPoints) ds.shift();
          labs.push('');
          if (labs.length > maxPoints) labs.shift();
          chart.update('none');
        }
      });
    };

    socket.on('update', handler);
    return () => socket.off('update', handler);
  }, [selectedNode]);

  // Limpa o gráfico ao trocar de nó monitorado
  const onChange = (e) => {
    setSelectedNode(e.target.value);
    const chart = chartRef.current;
    if (chart) {
      chart.data.labels = [];
      chart.data.datasets[0].data = [];
      chart.update();
    }
  };

  // Opções de nós dinâmicas
  const options = getNodes()
    .filter((n) => n.id !== id)
    .map((n) => ({ value: n.id, label: n.data.label || n.id }));

  return (
    <div style={{
      borderRadius: '10%',
      backgroundColor: '#f9f9f9',
      width: 260,
      height: 200,
      padding: 10,
      fontSize: 12,
      border: '1px solid #000',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ textAlign: 'center', fontWeight: 'normal', marginBottom: 5 }}>Graph Node</div>

      <select value={selectedNode} onChange={onChange} style={{ marginBottom: 8 }}>
        <option value="">-- Select Node --</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      <div style={{ flexGrow: 1, position: 'relative' }}>
        <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />
      </div>
      
    </div>
  );
}

export default memo(GraphNode);
