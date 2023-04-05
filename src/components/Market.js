import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js'

import { formatTenDecimalNum, keepDecimal2 } from './../utils/filter'
import { setActiveTradePair } from '../store/action';
import API from './../api/api'
import './../assets/css/components/market.css'

function Market() {
  const [marketsData, setMarketsData] = useState([]);
  const dispatch = useDispatch();
  const activeTradePair = useSelector(state => state.activeTradePair);

  useEffect(() => {
    API.getMarkets().then(result => {
      console.log('result', result)
      const market = result.data.slice(0, 1)
      market.forEach(v => {
        v.opening_price = keepDecimal2((new BigNumber(v.opening_price).times(formatTenDecimalNum(-6))).toString(10))
      })
      dispatch(setActiveTradePair(market[0]));
      setMarketsData(market);
    });
  }, [dispatch]);

  const switchTradePair = (item) => {
    dispatch(setActiveTradePair(item));
  }

  return (
    <div>
      <ul className='marketList'>
        {
          marketsData.map((item) => {
            return <li key={item.id} className={`market ${item.id === activeTradePair.id ? 'active': ''}`} onClick={() => switchTradePair(item)}>
              <div className="mui-fl-vert">
                <img src={item.icon} alt="" className="img-icon" />
                {/* <p className='img-icon-default mui-shr-0'></p> */}
                <div className='mui-fl-1'>
                  <p className="s">{ item.symbol_short }</p>
                  <p className="p">${ activeTradePair ? activeTradePair.current_price : item.opening_price }</p>
                </div>
              </div>
              
              <p className='changeP red'>{ activeTradePair ? activeTradePair.change_rate : '--' }</p>
            </li>
          })
        }
      </ul>
    </div>
  );
}

export default Market;
