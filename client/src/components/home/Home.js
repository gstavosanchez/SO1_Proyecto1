import { useContext, useEffect } from 'react';
import { w3cwebsocket } from 'websocket';
import { ProcesoContext } from '../../context/process/ProcesoContext';
import { ProcesoLista } from '../process/ProcesoLista';
import { Procesos } from '../process/Procesos';
// import { initialState } from './homeHelpers';

export const socket = new w3cwebsocket('ws://localhost:5000/ws/cpu');

export const Home = () => {
  // const [proceso, setProceso] = useState(initialState);
  const { setProcesState } = useContext(ProcesoContext);

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
      const json = JSON.parse(JSON.parse(e.data).data);
      console.log(json);
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
      socket.send(
        JSON.stringify({
          Sala: 'test2',
        })
      );
    };
  }, []);

  return (
    <div className="home__container animate__animated animate__fadeIn">
      <Procesos />
      <ProcesoLista />
    </div>
  );
};
