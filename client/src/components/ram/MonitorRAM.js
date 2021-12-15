import React, { useEffect, useState } from 'react';
import { w3cwebsocket } from 'websocket';
import { GraphLine } from '../graph/GraphLine';
import { initialState, arraySecond } from './helperRAM';

export const socket = new w3cwebsocket('ws://localhost:5000/ws');

export const MonitorRAM = () => {
  const [ramState, setRamState] = useState(initialState);
  const [mbList, setMbList] = useState([]);

  const { ram, porcentaje, uso } = ramState;

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
      setRamState({
        ...ramState,
        ram: data.ram,
        porcentaje: data.porcentaje,
        uso: data.uso,
      });

      setMbList([...mbList, data.porcentaje]);
    };
  }, [ramState, mbList]);

  useEffect(() => {
    socket.onopen = () => {
      socket.send('ram');
    };
  }, []);

  return (
    <div className="ram__container animate__animated animate__fadeIn">
      <div className="ram__card">
        <div className="card card__active">
          <div className="card__subtitle-left mb-1 mb-1">
            <h1>Uso Ram</h1>
            <i className="fas fa-memory icon-size ml-5"></i>
          </div>
          <p className="mb-1">Total: {ram} MB</p>
          <p className="mb-1">Uso: {uso} MB</p>
          <p className="mb-5">Porcetanje: {porcentaje} %</p>
        </div>
      </div>
      <div className="ram_graph-1">
        <div className="card card__active">
          <div className="card__subtitle-grap mb-1 mb-1">
            <h1>Historial de Uso (%)</h1>
            <i className="fas fa-file-medical-alt icon-size ml-5"></i>
          </div>
          <GraphLine value={mbList} labels={arraySecond} title="RAM %" />
        </div>
      </div>
    </div>
  );
};
