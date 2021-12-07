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
            Principal
            <i className="fas fa-home ml-2 mr-1"></i>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav__link ${isActive ? 'nav__link-active' : ''}`
            }
            to="/cpu"
          >
            CPU
            <i className="fas fa-cogs ml-2 mr-1"></i>
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              `nav__link ${isActive ? 'nav__link-active' : ''}`
            }
            to="/ram"
          >
            RAM
            <i className="fas fa-database ml-2 mr-1"></i>
          </NavLink>
        </div>
      </div>
    </nav>
  );
};
