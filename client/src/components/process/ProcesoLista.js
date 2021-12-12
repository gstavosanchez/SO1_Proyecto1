import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ProcesoContext } from '../../context/process/ProcesoContext';

export const ProcesoLista = () => {
  const navigate = useNavigate();
  const { procesState, setProcesSelected } = useContext(ProcesoContext);
  const { procesList } = procesState;

  const handleClickProces = (proces) => {
    setProcesSelected(proces);
    navigate('/proces/selected');
  };

  const handleDelete = (id, name) => {
    toast.dark(`Kill process ${name}`);
    console.log(id);
  };

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
              <th>{value.ram}</th>
              <th>
                <button
                  className="fas fa-pen icon-t button button-more mr-1"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleClickProces(value)}
                ></button>
                <button
                  className="fas fa-skull-crossbones icon-t button button-kill ml-5"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleDelete(value.pid, value.name)}
                ></button>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};
// ProcesoLista.propTypes = {
//   procesList: PropTypes.array.isRequired,
// };
