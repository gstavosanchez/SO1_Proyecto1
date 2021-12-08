import React from 'react';
import { w3cwebsocket } from 'websocket';
import { GraphLine } from '../graph/GraphLine';
// import socket from '../../helpers/socket';

export const MonitorRAM = () => {
  const socket = new w3cwebsocket('ws://localhost:5000/ws');
  socket.onopen = () => {
    socket.send(
      JSON.stringify({
        Sala: 'test',
      })
    );
  };

  socket.onmessage = (event) => {
    console.log(`[message] Data received from server: ${event.data}`);
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

  return (
    <div className="ram__container animate__animated animate__fadeIn">
      <div className="ram__card">
        <div className="card card__active">
          <div className="card__subtitle-left mb-1 mb-1">
            <h1>Uso Ram</h1>
            <i className="fas fa-memory icon-size ml-5"></i>
          </div>
          <p className="mb-1">Total: 11111 MB</p>
          <p className="mb-1">Uso: 11111MB</p>
          <p className="mb-5">Porcetanje: 45%</p>
        </div>
      </div>
      <div className="ram_graph-container">
        <div className="ram_graph-1">
          <div className="card card__active">
            <div className="card__subtitle-grap mb-1 mb-1">
              <h1>Historial de Uso (%)</h1>
              <i className="fas fa-file-medical-alt icon-size ml-5"></i>
            </div>
            <GraphLine
              labels={['a', 'b', 'c', 'd', 'f']}
              value={[1, 2, 3, 4, 5]}
              title="hola mundo"
            />
          </div>
        </div>
        <div className="ram_graph-2">
          <div className="card card__active">
            <div className="card__subtitle-grap mb-1 mb-1">
              <h1>Historial de Uso (MB)</h1>
              <i className="fas fa-file-medical-alt icon-size ml-5"></i>
            </div>
            <GraphLine
              labels={['a', 'b', 'c', 'd', 'f']}
              value={[1, 2, 3, 4, 5]}
              title="RAM"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
