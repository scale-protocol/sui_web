import { useEffect, useState, useCallback } from 'react';
import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux';
import { createChart } from 'lightweight-charts'
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

import API from './../api/api'
import './../assets/css/components/charts.css'
import candleImg from './../assets/img/candle.png'
import areaLineImg from './../assets/img/areaLine.png'
import { formatNum } from './../utils/filter'

const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;

let areaLineChat = null
let areaSeries = null
let candleChat = null
let candleSeries = null

function Charts() {
  const [timesType] = useState(['1H', '1D', '1W', '1M', '1Y'])
  const [timeTypeActive, setTimeTypeActive] = useState('1D')
  const [chartsTypeActive, setChartsTypeActive] = useState('areaLine')
  const [chartLoading, setChartLoading] = useState(false)
  const activeTradePair = useSelector(state => state.activeTradePair);

  const priceMap = (useSelector(state => state.wsModule.wsPrice))

  const [chartsType] = useState([
    { txt: 'areaLine', icon: areaLineImg },
    { txt: 'candle', icon: candleImg }
  ])

  const SetChartData = useCallback((data) => {
    const chartOptions = {
      layout: {
        textColor: 'rgba(0, 0, 0, 0.45)',
        background: { type: 'solid', color: 'white' }
      },
      localization: {
        locale: 'en',
        dateFormat: "yyyy-MM-dd",
        timeFormat: 'hh-mm'
      },
      timeScale: {
        borderColor: 'white'
      },
      grid: {
        vertLines: {
            color: "#fff",
            style: 0,
            visible: 1
        },
        horzLines: {
            color: "#fff",
            style: 0,
            visible: 1
        }
      },
      rightPriceScale: {
        borderVisible: false
      }
    }

    if (chartsTypeActive === 'areaLine') {
      if (areaLineChat) {
        areaSeries.setData(data)
        areaLineChat.timeScale().fitContent();
        return
      }
      areaLineChat = createChart(document.getElementById('areaLine'), chartOptions)
      areaSeries = areaLineChat.addAreaSeries({ lineColor: '#69D2F5', topColor: 'rgba(105, 210, 245, 0.1)', bottomColor: 'white' })
      areaSeries.setData(data);
      areaLineChat.timeScale().fitContent();
    }
    if (chartsTypeActive === 'candle') {
      if (candleChat) {
        candleSeries.setData(data)
        candleChat.timeScale().fitContent();
        return
      }
      candleChat = createChart(document.getElementById('candle'), chartOptions)
      candleSeries = candleChat.addCandlestickSeries({ upColor: '#41BA63', downColor: '#E76464', borderVisible: false, wickUpColor: '#41BA63', wickDownColor: '#E76464' })
      candleSeries.setData(data);
      candleChat.timeScale().fitContent();
    }
  }, [chartsTypeActive])

  const getChartsData = useCallback((symbol) => {
    if (!symbol) return
      setChartLoading(true)
      const type = chartsTypeActive === 'areaLine' ? 'history' : 'history_full'
      API.getChartsData(type, symbol, timeTypeActive).then(result => {
        if (type === 'history') {
          result.data.forEach((v) => {
            v.time = parseInt(Date.parse(v.time.toString()) / 1000)
            v.value = Number(new BigNumber(v.value).idiv(new BigNumber(1000000)).toString(10))
          })
          SetChartData(result.data)
        }
        if (type === 'history_full') {
          result.data.forEach((v) => {
            v.time = Date.parse(v.stop_time) / 1000
            v.open = v.open / 1000000
            v.close = v.close / 1000000
            v.low = v.low / 1000000
            v.high = v.high / 1000000
          })
          SetChartData(result.data)
        }
        setChartLoading(false)
    })
  }, [chartsTypeActive, SetChartData, timeTypeActive])
  
  const switchTimeType = useCallback((type) => {
    setTimeTypeActive(() => type)
  }, [])

  const switchChartsType = useCallback((type) => {
    setChartsTypeActive(() => type)
  }, [])

  useEffect(() => {
    getChartsData(activeTradePair?.symbol)
  }, [activeTradePair, getChartsData]);

  return (
    <div className='charts-wrapper'>
      <div>
        <div className='token-info'>
          <div className='token-name-img'>
            <img src={candleImg} alt="token img" />
            { activeTradePair?.symbol }
          </div>
          <ul className='mui-fl-vert numlist'>
            <li className="p">
              ${priceMap? priceMap && priceMap[activeTradePair.symbol]?.current_price_format : activeTradePair?.opening_price}
            </li>
            <li>
              <p>24H Change( %)</p>
              <p className={priceMap ? (priceMap && priceMap[activeTradePair.symbol]?.change_rate > 0 ? 'green' : 'red') : ''}>{ priceMap && priceMap[activeTradePair.symbol]?.change_rate ? formatNum(priceMap && priceMap[activeTradePair.symbol]?.change_rate) + '%' : '--' }</p>
            </li>
            <li>
              <p>24H Change</p>
              <p className={priceMap ? (priceMap && priceMap[activeTradePair.symbol]?.change > 0 ? 'green' : 'red') : ''}>{ priceMap && priceMap[activeTradePair.symbol]?.change ? formatNum(priceMap && priceMap[activeTradePair.symbol]?.change, '$') : '--'}</p>
            </li>
            <li>
              <p>24H High</p>
              <p>{priceMap && priceMap[activeTradePair.symbol]?.high_24h}</p>
            </li>
            <li>
              <p>24H Low</p>
              <p>{priceMap && priceMap[activeTradePair.symbol]?.low_24h}</p>
            </li>
          </ul>
        </div>
        <div className='mui-fl-vert'>
          <ul className='time-list mui-fl-vert'>
            {
              timesType.map((item, index) => {
                return <li key={'time-list' + index} className={`taplight ${item === timeTypeActive ? 'active' : ''}`} onClick={() => switchTimeType(item)}>{ item }</li>
              })
            }
          </ul>
          <div className='charts-type-list mui-fl-vert'>
            <p>Chat View</p>
            <div className='mui-fl-vert'>
              {
                chartsType.map((item, index) => {
                  return <img key={'charts-type-list' + index} src={item.icon} alt={item.txt} className={`taplight ${item.txt === chartsTypeActive ? 'active' : ''}`} onClick={() => switchChartsType(item.txt)} />
                })
              }
            </div>
          </div>
        </div>

        <div className='chart-wrap'>
          {chartLoading === true && <div className="chart-loading mui-fl-central">
            <Spin indicator={antIcon} />
          </div>}
          {chartsTypeActive === 'areaLine' && <div className='charts' id='areaLine'></div>}
          {chartsTypeActive === 'candle' && <div className='charts' id='candle'></div>}
        </div>
      </div>
    </div>
  );
}

export default Charts;