import { Link } from 'react-router-dom';

export const Home = () => {
  return (
    <div className="home__container animate__animated animate__fadeIn">
      <Link className="card mb-5" to="/process">
        <i className="fas fa-cogs card__numero mb-5"></i>
        <h1>Proceso Activos</h1>
      </Link>
      <Link className="card" to="/list-process">
        <i class="fas fa-list-ol card__numero mb-5"></i>
        <h1>Listado de proceso</h1>
      </Link>
    </div>
  );
};
