import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import BigNumber from 'bignumber.js'

import { setPriceMap, setUserInfo, setWsPositionUpdateData } from './../store/action'
// import { formatTenDecimalNum, keepDecimal2 } from './../utils/filter'
import { getPositionsListFun } from './../utils/positions'

import Header from '../components/Header';
import Market from '../components/Market';
import Charts from '../components/Charts';
import TradeForm from '../components/TradeForm';
import Positions from '../components/Positions';
// import Chatroom from '../components/Chatroom';
// import Counter from '../components/Counter';
import './../assets/css/views/home.css'

function Home() {
  const dispatch = useDispatch();
  const accountModule = useSelector(state => state.accountModule)
  const account = accountModule.account;
  const userInfo = useSelector(state => state.userInfo)
  const positionsModule = useSelector(state => state.positionsModule)
  const activePositions = positionsModule.activePositions;
  // const activeTradePair = useSelector(state => state.activeTradePair);

  const [wsUrl, setWsUrl] = useState('wss://dev-api.scale.exchange/ws?account=');
  const wsRef = useRef(null);
  const [connected, setConnected] = useState(false)

  useEffect(() => {
    if (wsUrl && !wsRef.current && !connected) {
      const newWs = (new WebSocket(wsUrl))
      wsRef.current = newWs;

      newWs.onopen = () => {
        setConnected(false)
        newWs.send(
          JSON.stringify({
              "symbol": "Crypto.BTC/USD",
              "sub_type": "subscribe"
          })
        )
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

          // const _activePositions = [...activePositions]
          // console.log('_activePositions', _activePositions)
          // _activePositions.forEach(v => {
          //   console.log('_activePositions', v)
          //   // v.latest = keepDecimal2((new BigNumber(data.current_price).times(formatTenDecimalNum(-6))).toString(10))
          // })
          // dispatch(setActivePositions(_activePositions))
          // console.log('price_update activePositions', activePositions)
          // if (activePositions.length > 0) {
          //   dispatch(updateActivePositions({
          //     list: [...activePositions],
          //     data
          //   }))
          // }


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
        }
      }
    }
    
    if (account && userInfo && activePositions && wsRef.current) {
      if (wsUrl !== `wss://dev-api.scale.exchange/ws?account=${account}`) {
          wsRef.current.close()
          wsRef.current = null;
          setWsUrl(`wss://dev-api.scale.exchange/ws?account=${account}`)
      }
    }
  }, [account, activePositions, connected, dispatch, userInfo, wsUrl]);

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
      
      {/* <Chatroom></Chatroom> */}
      {/* <div className='section'>
        <Counter />
      </div> */}
    </div>
  );
}

export default Home;