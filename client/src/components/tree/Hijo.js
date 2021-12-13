export const Hijo = ({ hijos }) => {
  return (
    <div className="tree__children-container">
      {hijos.map((value) => (
        <div className="tree__childer" key={value.id}>
          <i className="fas fa-angle-double-right"></i>
          <div className="tree__childre-title">
            <h1 className="mr-5">ID: {value.id}</h1>
            <h1 className="mr-5">Nombre: {value.name}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};
