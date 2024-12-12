import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { IpAddressProvider } from './IpAddressContext';

ReactDOM.render(
  <IpAddressProvider>
    <App />
  </IpAddressProvider>,
  document.getElementById('root')
);
