import React from 'react';

export const ProcesoLista = () => {
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
          <tr>
            <th>1</th>
            <th>systemd</th>
            <th>root</th>
            <th>S</th>
            <th>2.2</th>
            <th>
              <i className="fas fa-pen icon-color mr-1"></i>
              <i className="fas fa-skull-crossbones icon-color-red ml-5"></i>
            </th>
          </tr>
          <tr>
            <th>2</th>
            <th>systemd</th>
            <th>root</th>
            <th>S</th>
            <th>2.2</th>
            <th>
              <i className="fas fa-pen icon-color mr-1"></i>
              <i className="fas fa-skull-crossbones icon-color-red ml-5"></i>
            </th>
          </tr>
          <tr>
            <th>3</th>
            <th>systemd</th>
            <th>root</th>
            <th>S</th>
            <th>2.2</th>
            <th>
              <i className="fas fa-pen icon-color mr-1"></i>
              <i className="fas fa-skull-crossbones icon-color-red ml-5"></i>
            </th>
          </tr>
          <tr>
            <th>4</th>
            <th>systemd</th>
            <th>root</th>
            <th>S</th>
            <th>2.2</th>
            <th>
              <i className="fas fa-pen icon-color mr-1"></i>
              <i className="fas fa-skull-crossbones icon-color-red ml-5"></i>
            </th>
          </tr>
          <tr>
            <th>5</th>
            <th>systemd</th>
            <th>root</th>
            <th>S</th>
            <th>2.2</th>
            <th>
              <i className="fas fa-pen icon-color mr-1"></i>
              <i className="fas fa-skull-crossbones icon-color-red ml-5"></i>
            </th>
          </tr>
        </tbody>
      </table>
    </>
  );
};
