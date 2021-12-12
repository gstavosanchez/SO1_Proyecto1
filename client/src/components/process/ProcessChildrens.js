import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { ProcesoContext } from '../../context/process/ProcesoContext';

export const ProcessChildrens = () => {
  // const navigate = useNavigate();
  const { selected } = useContext(ProcesoContext);
  if (!selected) return <Navigate to="/" />;
  const { pid, name, user, state, ram, children } = selected;
  return (
    <div className="children__container animate__animated animate__fadeIn">
      <div className="card card__active">
        <div className="card__subtitle-space mb-1 mb-1">
          <h1>Proceso ID: {pid}</h1>
          <i className="fas fa-microchip icon-size ml-5"></i>
        </div>
        <p className="mb-1">Nombre: {name}</p>
        <p className="mb-1">Usario: {user}</p>
        <p className="mb-1">Estado: {state}</p>
        <p className="mb-1">RAM: {ram} %</p>
      </div>
      {children.map((value) => (
        <div className="card" key={value.id} data-aos="zoom-in">
          <div className="card__subtitle-space mb-1 mb-1">
            <h1>ID: {value.id}</h1>
            <i className="fas fa-microchip icon-size ml-5"></i>
          </div>
          <p className="">Nombre: {name}</p>
        </div>
      ))}
    </div>
  );
};
