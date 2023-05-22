import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import reportWebVitals from './reportWebVitals';
import Routers from './routers'
import { store } from './store'
import './assets/css/main.css'
import 'antd/dist/reset.css';

import { WalletProvider } from '@suiet/wallet-kit';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
    <WalletProvider>
      <Routers></Routers>
    </WalletProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
