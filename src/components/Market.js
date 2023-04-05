import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js'

import { formatTenDecimalNum, keepDecimal2 } from './../utils/filter'
import { setActiveTradePair } from '../store/action';
import API from './../api/api'
import './../assets/css/components/market.css'

function Market() {
  const priceMap = useSelector(state => state.wsModule.wsPrice)
  const [marketsData, setMarketsData] = useState([]);
  const dispatch = useDispatch();
  const activeTradePair = useSelector(state => state.activeTradePair);

  const currentPrice = priceMap?.current_price || ''
  const changeRate = priceMap?.change_rate || ''

  useEffect(() => {
    API.getMarkets().then(result => {
      console.log('result', result)
      const market = result.data
      market.forEach(v => {
        v.opening_price = keepDecimal2((new BigNumber(v.opening_price).times(formatTenDecimalNum(-6))).toString(10))
      })
      dispatch(setActiveTradePair(market[0]));
      setMarketsData(market);
    });
  }, [dispatch]);
  
  // const _marketsData = JSON.parse(JSON.stringify(marketsData))
  // _marketsData.forEach(v => {
  //   v.opening_price = keepDecimal2((new BigNumber(priceMap?.current_price).times(formatTenDecimalNum(-6))).toString(10))
  //   v.change_rate = keepDecimal2((new BigNumber(priceMap?.change_rate).times(formatTenDecimalNum(-6))).toString(10))
  // })

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
                  <p className="p">${ currentPrice ? currentPrice : item.opening_price }</p>
                </div>
              </div>
              
              <p className='changeP red'>{ changeRate ? changeRate + '%' : '--' }</p>
            </li>
          })
        }
      </ul>
    </div>
  );
}

export default Market;
