import Websocket from 'react-websocket';
import { useState } from 'react'
import { setPriceMap } from './../store/action'
import { useDispatch } from 'react-redux';


function Chatroom () {
  
  const dispatch = useDispatch();
    const [subscribed, setSubscribed] = useState(false)
    const [refWebSocket, setRefWebSocket] = useState(false)
    const [messages, setMessages] = useState([])
    

  const componentDidMount = () => {
    // 订阅 WebSocket
    setSubscribed(true)
  }

  const componentWillUnmount = () => {
    // 取消订阅 WebSocket
    // this.setState({ subscribed: false });
    setSubscribed(false)
  }

  const handleOpen = () => {
    console.log('WebSocket connected');
    
      // 发送订阅消息
      refWebSocket.sendMessage(JSON.stringify({
        "symbol": "Crypto.BTC/USD",
        "sub_type": "subscribe"
    }));
  }

  const handleClose = () => {
    console.log('WebSocket disconnected');
  }

  const handleMessage = (message) => {
    // console.log('WebSocket message received:', message);
    dispatch(setPriceMap(message))
  }

  const handleError = (error) => {
    console.error('WebSocket error:', error);
  }

    return (
      <div>
        <Websocket
          url="wss://dev-api.scale.exchange/ws?account"
          onOpen={handleOpen}
          onClose={handleClose}
          onMessage={handleMessage}
          onError={handleError}
          ref={(Websocket) => {
            setRefWebSocket(Websocket)
          }}
        />
        {/* {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))} */}
      </div>
    );
}

export default Chatroom;
