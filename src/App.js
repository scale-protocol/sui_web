import './App.css';
import { Button } from 'antd';
import { EthosConnectProvider, ethos } from "ethos-connect";

function App() {
  const ethosConfiguration = {
    apiKey: "ethos-example-app",
    preferredWallets: ['Ethos Wallet'],
    hideEmailSignIn: true
  };
  return (
    <div className="App">
      <EthosConnectProvider
        ethosConfiguration={ethosConfiguration}
        dappName="EthosConnect Example App"
        connectMessage="Your connect message goes here!"
      >
        <Button type="primary">Button</Button>
        <ethos.components.AddressWidget />
      </EthosConnectProvider>
    </div>
  );
}

export default App;
