import React from 'react';
import ReactDOM from 'react-dom';
import { ClientApp } from './ClientApp';

import './styles/styles.scss';

ReactDOM.render(
  <React.StrictMode>
    <ClientApp />
  </React.StrictMode>,
  document.getElementById('root')
);
