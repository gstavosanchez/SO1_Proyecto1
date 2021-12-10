import PropTypes from 'prop-types';
export const ProcesoLista = ({ procesList }) => {
  return (
    <>
      <table className="content-table animate__animated animate__fadeIn">
        <thead>
          <tr>
            <th>PID</th>
            <th>Nombre</th>
            <th>Usuario</th>
            <th>Estado</th>
            <th>%RAM</th>
            <th>Opciones</th>
          </tr>
        </thead>
        <tbody>
          {procesList.map((value, i) => (
            <tr key={i}>
              <th>{value.pid}</th>
              <th>{value.name}</th>
              <th>{value.user}</th>
              <th>{value.state}</th>
              <th>2.2</th>
              <th>
                <i className="fas fa-pen icon-color mr-1"></i>
                <i className="fas fa-skull-crossbones icon-color-red ml-5"></i>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
ProcesoLista.propTypes = {
  procesList: PropTypes.array.isRequired,
};
