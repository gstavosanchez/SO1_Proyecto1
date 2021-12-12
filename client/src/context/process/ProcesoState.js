import { useReducer } from 'react';
import { procesoReducer } from './procesoReducer';
import { ProcesoContext } from './ProcesoContext';
import { initialState } from '../../components/home/homeHelpers';
import { types } from '../types/types';
import { executeKillApi } from '../../helpers/helper';

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

  const killProcesExec = async (id) => {
    const res = await executeKillApi(id);
    dispatch({
      type: types.kill,
      payload: res,
    });
  };

  return (
    <ProcesoContext.Provider
      value={{
        procesState,
        setProcesState,
        setProcesSelected,
        killProcesExec,
        selected: procesState.selectedProces,
        kill: procesState.killProces,
      }}
    >
      {props.children}
    </ProcesoContext.Provider>
  );
};
