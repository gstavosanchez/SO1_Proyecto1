import { useContext, useEffect, useState } from 'react';
import { w3cwebsocket } from 'websocket';
import { ProcesoContext } from '../../context/process/ProcesoContext';
import { ProcesoLista } from '../process/ProcesoLista';
import { Procesos } from '../process/Procesos';
import { ProcessTree } from '../tree/ProcessTree';
// import { initialState } from './homeHelpers';

export const socket = new w3cwebsocket('ws://localhost:5000/ws');

export const Home = () => {
  const { setProcesState } = useContext(ProcesoContext);
  const [selectedProcess, setSelectedProcess] = useState(0);

  socket.onerror = (error) => {
    console.log(`[error] ${error.message}`);
  };

  socket.onclose = (event) => {
    if (event.wasClean) {
      console.log(
        `[close] Connection closed cleanly,
        code=${event.code} reason=${event.reason}`
      );
    } else {
      console.log('[close] Connection died');
    }
  };

  useEffect(() => {
    socket.onmessage = (e) => {
      const json = JSON.parse(JSON.parse(e.data).data);
      const procesoJson = {
        ejecucion: json.process_running,
        suspendidos: json.process_sleeping,
        zombie: json.process_zombie,
        detenidos: json.process_stopped,
        total: json.total_processes,
        procesList: json.processes,
      };
      setProcesState(procesoJson);
    };
  }, [setProcesState]);

  useEffect(() => {
    socket.onopen = () => {
      socket.send('home');
    };
  }, []);

  const handleTree = () => {
    setSelectedProcess(2);
  };

  const handleList = () => {
    setSelectedProcess(1);
  };

  return (
    <div className="home__container animate__animated animate__fadeIn">
      <Procesos />
      <div className="card card-select mb-1">
        <div className="card-select-icon tree" onClick={handleTree}>
          <i className="fas fa-tree"></i>
          <p>Árbol de Procesos</p>
        </div>
        <div className="card-select-icon lista" onClick={handleList}>
          <i className="fas fa-list-ol"></i>
          <p>Lista de Procesos</p>
        </div>
      </div>
      {selectedProcess === 1 && <ProcesoLista />}
      {selectedProcess === 2 && <ProcessTree />}
    </div>
  );
};
