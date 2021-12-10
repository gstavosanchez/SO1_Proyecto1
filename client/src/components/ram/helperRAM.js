export const initialState = {
  ram: 0,
  libre: 0,
  uso: 0,
  porcentaje: 0,
};
export const arraySecond = [...Array(100).keys()].sort((a, b) => b - a);

export const strToJSON = (dataStr) => {
  // {'ram': 11893,'libre': 2158,'uso': 9354,'porcentaje': 78}
  const dataStr1 = String(dataStr).toString();
  const splitComa = dataStr1.split(',');

  const ramSplit = splitComa[0].split(':');
  const libreSplit = splitComa[1].split(':');
  const usoSplit = splitComa[2].split(':');
  const porcentSplit = splitComa[3].split(':');

  return {
    ram: parseInt(ramSplit[1].trim()),
    libre: parseInt(libreSplit[1].trim()),
    uso: parseInt(usoSplit[1].trim()),
    porcentaje: parseInt(porcentSplit[1].trim()),
  };
};

export const getMinute = () => {
  const today = new Date();
  const minute = today.getMinutes() + ':' + today.getSeconds();
  return minute;
};
