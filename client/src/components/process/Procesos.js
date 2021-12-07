import React from 'react';

export const Procesos = () => {
  return (
    <div className="card-container mt-10 animate__animated animate__fadeIn">
      <div className="card">
        <p className="card__numero">15</p>
        <h1>Proceso en ejecución</h1>
      </div>
      <div className="card">
        <p className="card__numero">15</p>
        <h1>Proceso suspendidos</h1>
      </div>
      <div className="card">
        <p className="card__numero">15</p>
        <h1>Procesos detenidos</h1>
      </div>
      <div className="card">
        <p className="card__numero">15</p>
        <h1>Procesos zombie</h1>
      </div>
      <div className="card">
        <p className="card__numero">15</p>
        <h1>Total de procesos</h1>
      </div>
    </div>
  );
};
