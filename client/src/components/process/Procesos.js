import { useContext } from 'react';
import { ProcesoContext } from '../../context/process/ProcesoContext';

export const Procesos = () => {
  const { procesState } = useContext(ProcesoContext);
  const { ejecucion, suspendidos, detenidos, zombie, total } = procesState;

  return (
    <div className="mt-5 animate__animated animate__fadeIn">
      <div className="card-container">
        <div className="card">
          <p className="card__numero">{ejecucion}</p>
          <div className="card__subtitle">
            <h1>Ejecución</h1>
          </div>
        </div>
        <div className="card">
          <p className="card__numero">{suspendidos}</p>
          <div className="card__subtitle">
            <h1>Suspendidos</h1>
          </div>
        </div>
        <div className="card">
          <p className="card__numero">{detenidos}</p>
          <div className="card__subtitle">
            <h1>Detenidos</h1>
          </div>
        </div>
        <div className="card">
          <p className="card__numero">{zombie}</p>
          <div className="card__subtitle">
            <h1>Zombie</h1>
          </div>
        </div>
        <div className="card">
          <p className="card__numero">{total}</p>
          <div className="card__subtitle">
            <h1>Total</h1>
          </div>
        </div>
      </div>
    </div>
  );
};
