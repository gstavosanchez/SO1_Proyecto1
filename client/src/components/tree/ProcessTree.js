import { useContext, useState } from 'react';
import { ProcesoContext } from '../../context/process/ProcesoContext';
import { Hijo } from './Hijo';

export const ProcessTree = () => {
  // animate__bounceInDown
  const [flag, setFlag] = useState(false);

  const { procesState, setProcesSelected, selected } =
    useContext(ProcesoContext);
  const { procesList } = procesState;

  const handleClickProces = (proces) => {
    if (!flag) {
      setProcesSelected(proces);
      setFlag(true);
    } else {
      setProcesSelected(null);
      setFlag(false);
    }
  };
  //
  return (
    <div className="">
      {procesList.map((value) => (
        <div key={value.pid}>
          <div className="tree__item" onClick={() => handleClickProces(value)}>
            <div className="tree__root">
              <div className="tree__title">
                <i
                  className={
                    selected?.pid === value.pid
                      ? 'fas fa-chevron-right fa-che-active'
                      : 'fas fa-chevron-right'
                  }
                ></i>

                <h1>PID: {value.pid}</h1>
              </div>
              <div className="tree__description">
                <h1>Proceso: {value.name}</h1>
                <h1>Usuario: {value.user}</h1>
                <h1>Estado: {value.state}</h1>
                <h1>Ram: {value.ram} %</h1>
                <h1>Subprocesos: {value.children.length}</h1>
              </div>
            </div>
          </div>
          {selected?.pid === value.pid && <Hijo hijos={value.children} />}
        </div>
      ))}
    </div>
  );
};
