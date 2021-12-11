import { useReducer } from 'react';
import { procesoReducer } from './procesoReducer';
import { ProcesoContext } from './ProcesoContext';
import { initialState } from '../../components/home/homeHelpers';
import { types } from '../types/types';

export const ProcesoState = (props) => {
  const [procesState, dispatch] = useReducer(procesoReducer, initialState);

  const setProcesState = (proceso) => {
    dispatch({
      type: types.proceso,
      payload: proceso,
    });
  };

  const setProcesSelected = (proceso) => {
    dispatch({
      type: types.selected,
      payload: proceso,
    });
  };

  return (
    <ProcesoContext.Provider
      value={{
        procesState,
        setProcesState,
        setProcesSelected,
        selected: procesState.selectedProces,
      }}
    >
      {props.children}
    </ProcesoContext.Provider>
  );
};
