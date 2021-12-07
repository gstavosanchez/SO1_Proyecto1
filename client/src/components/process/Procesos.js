import React from 'react';

export const Procesos = () => {
  return (
    <div className="mt-5 animate__animated animate__fadeIn">
      <div className="card-container">
        <div className="card">
          <p className="card__numero">15</p>
          <div className="card__subtitle">
            <h1>Ejecución</h1>
          </div>
        </div>
        <div className="card">
          <p className="card__numero">15</p>
          <div className="card__subtitle">
            <h1>Suspendidos</h1>
          </div>
        </div>
        <div className="card">
          <p className="card__numero">15</p>
          <div className="card__subtitle">
            <h1>Detenidos</h1>
          </div>
        </div>
        <div className="card">
          <p className="card__numero">15</p>
          <div className="card__subtitle">
            <h1>Zombie</h1>
          </div>
        </div>
        <div className="card">
          <p className="card__numero">15</p>
          <div className="card__subtitle">
            <h1>Total</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
