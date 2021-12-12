import { types } from '../types/types';

export const procesoReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case types.proceso:
      return {
        ...state,
        ejecucion: payload.ejecucion,
        suspendidos: payload.suspendidos,
        detenidos: payload.detenidos,
        zombie: payload.zombie,
        total: payload.total,
        procesList: payload.procesList,
      };
    case types.selected:
      return {
        ...state,
        selectedProces: payload,
      };
    case types.kill:
      return {
        ...state,
        killProces: payload,
      };
    default:
      return state;
  }
};
