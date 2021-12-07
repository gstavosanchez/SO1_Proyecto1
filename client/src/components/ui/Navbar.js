import { NavLink } from 'react-router-dom';
export const Navbar = () => {
  return (
    <nav className="nav__navbar">
      <div className="nav__contenedor">
        <h2 className="nav__logotipo">Monitor</h2>

        <div className="">
          <NavLink
            className={({ isActive }) =>
              `nav__link ${isActive ? 'nav__link-active' : ''}`
            }
            to="/home"
          >
            <i className="fas fa-home ml-5 mr-2"></i>
            Inicio
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav__link ${isActive ? 'nav__link-active' : ''}`
            }
            to="/cpu"
          >
            <i className="fas fa-cogs ml-2 mr-2"></i>
            CPU
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav__link ${isActive ? 'nav__link-active' : ''}`
            }
            to="/ram"
          >
            <i className="fas fa-database ml-2 mr-2"></i>
            RAM
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
