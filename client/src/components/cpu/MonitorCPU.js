import { useEffect, useState } from 'react';
import { w3cwebsocket } from 'websocket';
import { GraphLine } from '../graph/GraphLine';
import { arraySecond } from '../ram/helperRAM';

export const socket = new w3cwebsocket('ws://localhost:5000/ws');

export const MonitorCPU = () => {
  const [cpuUso, setCpuUso] = useState({
    uso: 0,
  });
  const [usoList, setUsoList] = useState([]);
  const { uso } = cpuUso;

  socket.onerror = (error) => {
    console.log(`[error] ${error.message}`);
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      console.log(
        `[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`
      );
    } else {
      console.log('[close] Connection died');
    }
  };

  useEffect(() => {
    socket.onmessage = (e) => {
      const { data } = JSON.parse(e.data);
      setCpuUso({
        ...cpuUso,
        uso: data.uso,
      });

      setUsoList([...usoList, data.uso]);
    };
  }, [cpuUso, usoList]);

  useEffect(() => {
    socket.onopen = () => {
      socket.send('cpu');
    };
  }, []);

  return (
    <div className="ram__container animate__animated animate__fadeIn">
      <div className="ram__card">
        <div className="card card__active">
          <div className="card__subtitle-left mb-1 mb-1">
            <h1>Cpu</h1>
            <i className="fas fa-microchip icon-size ml-5"></i>
          </div>
          <p className="mb-5"></p>
          <p className="mb-5">Uso: {uso} %</p>
          <p className="mb-5"></p>
        </div>
      </div>
      <div className="ram_graph-1">
        <div className="card card__active">
          <div className="card__subtitle-grap mb-1 mb-1">
            <h1>Uso del CPU</h1>
            <i className="fas fa-file-medical-alt icon-size ml-5"></i>
          </div>
          <GraphLine value={usoList} labels={arraySecond} title="CPU %" />
        </div>
      </div>
    </div>
  );
};
