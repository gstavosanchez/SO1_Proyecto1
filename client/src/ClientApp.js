import { AppRouter } from './routers/AppRouter';
import { ProcesoState } from './context/process/ProcesoState';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const ClientApp = () => {
  return (
    <ProcesoState>
      <AppRouter />
      <ToastContainer />
    </ProcesoState>
  );
};
