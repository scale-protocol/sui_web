import React from 'react';
import ReactDOM from 'react-dom/client';
import { EthosConnectProvider } from "ethos-connect";
import { Provider } from 'react-redux';
import { NETWORK } from './utils/token';
import reportWebVitals from './reportWebVitals';
import Routers from './routers'
import { store } from './store'
import './assets/css/main.css'
import 'antd/dist/reset.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
const ethosConfiguration = {
  apiKey: "ethos-example-app",
  preferredWallets: ['Ethos Wallet'],
  hideEmailSignIn: true,
  // network: 'https://wallet-rpc.devnet.sui.io/'
  network: NETWORK
};
root.render(
  <Provider store={store}>
    <EthosConnectProvider
      ethosConfiguration={ethosConfiguration}
      dappName="EthosConnect Example App"
      connectMessage="Wallet!">
      <Routers></Routers>
    </EthosConnectProvider>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
