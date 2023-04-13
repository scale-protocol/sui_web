import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, Button } from 'antd';

import { setPriceMap, setUserInfo, setWsPositionUpdateData, setSpreadMap } from './../store/action'
import { getPositionsListFun } from './../utils/positions'

import Header from '../components/Header';
import Market from '../components/Market';
import Charts from '../components/Charts';
import TradeForm from '../components/TradeForm';
import Positions from '../components/Positions';
import welcome from './../assets/img/welcome.png'
import './../assets/css/views/home.css'


function Home() {
  const dispatch = useDispatch();
  const accountModule = useSelector(state => state.accountModule)
  const account = accountModule.account;
  const userInfo = useSelector(state => state.userInfo)
  const positionsModule = useSelector(state => state.positionsModule)
  const activePositions = positionsModule.activePositions
  const marketsData = useSelector(state => state.market)
  const priceMap = useSelector(state => state.wsModule.wsPrice)
  const activeTradePair = useSelector(state => state.activeTradePair);

  document.title = (priceMap && priceMap[activeTradePair.symbol] && `${priceMap[activeTradePair.symbol].current_price} | ${activeTradePair.symbol_short} | Scale`) || 'Scale'
  const [wsUrl, setWsUrl] = useState('wss://test-api.scale.exchange/ws?account=');
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (marketsData.length > 0) {
      if (wsUrl && !wsRef.current && !connected) {
        const newWs = (new WebSocket(wsUrl))
        wsRef.current = newWs;
  
        newWs.onopen = () => {
          setConnected(false)
          marketsData.length > 0 && marketsData.forEach(v => {
            newWs.send(
              JSON.stringify({
                  "symbol": v.symbol,
                  "sub_type": "subscribe"
              })
            )
          })
        }
  
        newWs.onclose = () => {
          setConnected(false)
        }
  
        newWs.onerror = () => console.log('WebSocket connection error');
  
        newWs.onmessage = (message) => {
          const { event, data } = JSON.parse(message.data)
  
          // 价格更新
          if (event === 'price_update') {
            dispatch(setPriceMap(data))
  
            // 账号更新
          } else if (event === 'account_update') {
            dispatch(setUserInfo(Object.assign({}, userInfo, data)));
  
            // 仓位更新
          } else if (event === 'position_update') {
            dispatch(setWsPositionUpdateData(data))
  
            // 开仓
          } else if (event === 'position_open') {
            getPositionsListFun('active', account, dispatch)
            // 关仓
          } else if (event === 'position_close') {
            getPositionsListFun('active', account, dispatch)
            getPositionsListFun('history', account, dispatch)

            // 点差
          } else if (event === 'spread_update') {
            dispatch(setSpreadMap(data))
          }
        }
      }
      
      if (account && userInfo && activePositions && wsRef.current) {
        if (wsUrl !== `wss://test-api.scale.exchange/ws?account=${account}`) {
            wsRef.current.close()
            wsRef.current = null;
            setWsUrl(`wss://test-api.scale.exchange/ws?account=${account}`)
        }
      }

    }
  }, [account, activePositions, connected, dispatch, marketsData, userInfo, wsUrl]);

  // const isModalOpen = () => {}
  const [isModalOpen, setIsModalOpen] = useState(localStorage.getItem('hasWelcome') ? false : true)
  const handleOk = () => {
    setIsModalOpen(false)
  }
  const handleCancel = () => {
    setIsModalOpen(false)
    localStorage.setItem('hasWelcome', false)
  }
  return (
    <div>
      <Header />
      <div className='mui-content'>
        <div className='section mui-flex'>
          <Market />
          <Charts></Charts>
          <TradeForm></TradeForm>
        </div>
        <div className='section'>
          <Positions></Positions>
        </div>
      </div>
      
      <Modal className="sty1-modal header-modal" centered width={386} okText='Confirm' footer={[]} open={isModalOpen} onCancel={handleCancel}>
        <div className='welcome mui-fl-col mui-fl-vert'>
          <img src={welcome} alt='' />
          <p className='t1'>Welcome to Scale!</p>
          <ul>
            <li className='mui-fl-vert'>
              <p>1</p>
              <p>Please connect your wallet.</p>
            </li>
            <li className='mui-fl-vert'>
              <p>2</p>
              <p>Please click Deposit to complete funding.</p>
            </li>
            <li className='mui-fl-vert'>
              <p>3</p>
              <p>Now, you can start trading.</p>
            </li>
          </ul>
          
          <Button className="welcome-got-it-btn" type="primary" size='large' shape="round" onClick={() => handleOk()}>
            Got it
          </Button>
        </div>
      </Modal>
    </div>
  );
}

export default Home;