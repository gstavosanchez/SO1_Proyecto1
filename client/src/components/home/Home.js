import { ProcesoLista } from '../process/ProcesoLista';
import { Procesos } from '../process/Procesos';

export const Home = () => {
  return (
    <div className="home__container animate__animated animate__fadeIn">
      <Procesos />
      <ProcesoLista />
    </div>
  );
};

// <div className="home__container animate__animated animate__fadeIn">
//       <Link className="card mb-5" to="/process">
//         <i className="fas fa-cogs card__numero mb-5"></i>
//         <div className="card__subtitle">
//           <h1>Proceso Activos</h1>
//         </div>
//       </Link>
//       <Link className="card" to="/list-process">
//         <i class="fas fa-list-ol card__numero mb-5"></i>
//         <div className="card__subtitle">
//           <h1>Listado de proceso</h1>
//         </div>
//       </Link>
//     </div>
