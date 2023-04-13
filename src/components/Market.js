import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js'

import { formatTenDecimalNum, keepDecimal2, formatNum } from './../utils/filter'
import { setActiveTradePair, setMarketListData } from '../store/action';
import API from './../api/api'
import './../assets/css/components/market.css'

function Market() {
  const priceMap = useSelector(state => state.wsModule.wsPrice)
  const marketsData = useSelector(state => state.market)
  const dispatch = useDispatch();
  const activeTradePair = useSelector(state => state.activeTradePair);

  useEffect(() => {
    API.getMarkets().then(result => {
      const _data = []
      result.data.forEach(v => {
        v.point = v.symbol_short === 'DOGE-USD' ? 6 : 2
        if (v.symbol_short === 'BTC-USD') {
          _data.unshift(v)
        } else {
          _data.push(v)
        }
      })
      const market = _data
      market.forEach(v => {
        v.opening_price = keepDecimal2((new BigNumber(v.opening_price).times(formatTenDecimalNum(-6))).toString(10))
      })
      dispatch(setActiveTradePair(market[0]));
      dispatch(setMarketListData(market))
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
                  <p className="p">${ priceMap && priceMap[item.symbol] ? priceMap[item.symbol].current_price : item.opening_price }</p>
                </div>
              </div>
              
              <p className={priceMap && priceMap[item.symbol] && priceMap[item.symbol].change_rate > 0 ? 'changeP green' : 'changeP red'}>
                {priceMap && priceMap[item.symbol] ? formatNum((priceMap[item.symbol].change_rate) || 0) + '%' : '--'}
              </p>
            </li>
          })
        }
      </ul>
    </div>
  );
}

export default Market;
