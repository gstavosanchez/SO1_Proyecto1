import { AppRouter } from './routers/AppRouter';
import { ProcesoState } from './context/process/ProcesoState';

export const ClientApp = () => {
  return (
    <ProcesoState>
      <AppRouter />
    </ProcesoState>
  );
};
