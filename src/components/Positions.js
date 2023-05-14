import { Button, Space, Table, Tabs, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethos } from "ethos-connect";

import { closePosition } from './../utils/sui'
import './../assets/css/components/positions.css'
import { getPositionsListFun } from './../utils/positions'
import { formatNum } from '../utils/filter';

function Positions() {
  const [messageApi, contextHolder] = message.useMessage()

  const { wallet } = ethos.useWallet();
  const accountModule = useSelector(state => state.accountModule)
  const account = accountModule.account;
  const address = accountModule.address;
  const [tabActive, setTabActive] = useState('active')
  const priceMap = useSelector(state => state.wsModule.wsPrice)

  const positionsModule = useSelector(state => state.positionsModule)
  const activePositions = positionsModule.activePositions;
  const historyPositions = positionsModule.historyPositions;
  const activeTradePair = useSelector(state => state.activeTradePair);
  const wsPositionUpdateData = positionsModule.wsPositionUpdateData;
  const dispatch = useDispatch();


  const activeColumns = [
    {
      title: 'Order',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order - b.order,
      key: 'active-order',
      width: 152,
      render: (_, record) => (
        <Space>
          <div className='mui-fl-vert positions-order'>
            <img src={record.icon}  alt='asd'/>
            <span>{record.symbol_short}</span>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      key: 'active-type',
      width: 108,
      render: (_, record) => (
          <p className={record.direction.toLocaleUpperCase() === 'BUY' ? 'green' : 'red'}>{ (record.direction).toLocaleUpperCase() === 'BUY' ? 'SHORT' : 'LONG' }</p>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'lot',
      key: 'active-size',
      width: 108
    },
    {
      title: 'Leverage',
      key: 'active-leverage',
      width: 108,
      render: (_, record) => (
          <p className='position-leverage'>{ record.leverageFormat }</p>
      )
    },
    {
      title: 'Open',
      dataIndex: 'open_price',
      key: 'active-open',
      width: 152
    },
    {
      title: 'Latest',
      key: 'active-latest',
      width: 152,
      render: (_, record) => (
          <p>{ priceMap && priceMap[record.symbol]?.current_price }</p>
      ),
    },
    {
      title: 'Profit',
      key: 'active-profit',
      width: 152,
      render: (_, record) => (
        <Space>
          <p className={wsPositionUpdateData && wsPositionUpdateData?.[record.id] > 0 ? 'green' : 'red'}>
            { formatNum((wsPositionUpdateData?.[record.id]) || 0, '$') }
          </p>
        </Space>
      ),
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      key: 'active-margin',
      width: 110
    },
    {
      title: 'Action',
      key: 'active-action',
      width: 152,
      render: (_, record) => (
        <div className='mui-fl-vert'>
          <Button className='posotion-list-close-btn' onClick={() => handleActiveClose(record)} type="primary" shape="round">Close</Button>
          <p className='position-list-icon mui-fl-central taplight' onClick={() => handleHistoryView(record)}>
            <i className='mico-share' />
          </p>
        </div>
      ),
    }
  ];

  const historyColumns = [
    {
      title: 'Order',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order - b.order,
      key: 'history-order',
      width: 200,
      render: (_, record) => (
        <Space>
          <div className='mui-fl-vert positions-order'>
            <img src={record.icon}  alt='asd'/>
            <span>{record.symbol_short}</span>
          </div>
        </Space>
      ),
    },
    {
      title: 'Type',
      key: 'history-type',
      width: 200,
      render: (_, record) => (
          <p className={record.direction.toLocaleUpperCase() === 'BUY' ? 'green' : 'red'}>{ (record.direction).toLocaleUpperCase() === 'BUY' ? 'LONG' : 'SHORT' }</p>
      ),
    },
    {
      title: 'Size',
      dataIndex: 'lot',
      key: 'history-size',
      width: 200
    },
    {
      title: 'Leverage',
      key: 'history-leverage',
      width: 200,
      render: (_, record) => (
          <p className='position-leverage'>{ record.leverageFormat }</p>
      )
    },
    {
      title: 'Open',
      dataIndex: 'open_price',
      key: 'history-open_price',
      width: 200
    },
    {
      title: 'Close Price',
      dataIndex: 'close_price',
      key: 'history-close_price',
      width: 200
    },
    // {
    //   title: 'Latest',
    //   dataIndex: 'latest',
    //   key: 'latest',
    // },
    {
      title: 'Profit',
      key: 'history-profit',
      width: 200,
      render: (_, record) => (
          <Space>
            <p className={record.profit > 0 ? 'green' : 'red'}>{ formatNum(record.profit, '$') }</p>
          </Space>
      )
    },
    {
      title: 'Status',
      key: 'history-status',
      width: 200,
      render: (_, record) => (
        <p>Closed</p>
      ),
    },
    {
      title: 'Sui Explorer',
      key: 'history-action',
      render: (_, record) => (
        <Space size="middle">
          <p className='position-list-icon mui-fl-central taplight' onClick={() => handleHistoryView(record)}>
            <i className='mico-share' />
          </p>
        </Space>
      ),
    },
  ];

  const tabsItems = [
    {
      key: 'active',
      label: `Position`,
      children: <Table columns={activeColumns} dataSource={address ? activePositions : []} />,
    },
    {
      key: 'history',
      label: `History`,
      children: <Table columns={historyColumns} dataSource={address ? historyPositions : []} />,
    }
  ]


  const onTabsChange = useCallback((key) => {
    setTabActive(key)
  }, [])

  const getPositionsList = useCallback(() => {
    if (!account) return
    getPositionsListFun(tabActive, account, dispatch)
  }, [account, dispatch, tabActive])

  const handleActiveClose = useCallback(async (record) => {
    try {
      const rp = await closePosition(wallet, account, record.id, activeTradePair.id)
      if (rp.confirmedLocalExecution) {
        messageApi.open({
          type: 'success',
          content: 'Close Position successful.',
          style: {
            marginTop: 77
          }
        })
        setTimeout(() => {
          getPositionsListFun('active', account, dispatch)
          getPositionsListFun('history', account, dispatch)
        }, 3000)
      } else {
        messageApi.open({
          type: 'warning',
          content: 'Close Position fail, Please try again later.',
          style: {
            marginTop: 77
          }
        })
      }
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: e.message,
        style: {
          marginTop: 77
        }
      })
    }
  }, [account, activeTradePair?.id, dispatch, messageApi, wallet])

  const handleHistoryView = useCallback((record) => {
    window.open(`https://explorer.sui.io/object/${record.id}?network=mainnet`)
  }, [])
  
  useEffect(() => {
    // if (activePositions.length > 0 && wsPositionUpdateData) {
    //   console.log('wsPositionUpdateData', wsPositionUpdateData)
    //   let updateData = null
    //   updateData = activePositions.map(v => {
    //     if (v.id === wsPositionUpdateData?.id) {
    //       console.log('======', wsPositionUpdateData.profit)
    //       const asd = Object.assign({}, {...v}, {profit: wsPositionUpdateData.profit})
    //       console.log('asd', asd)
    //       return asd
    //     }
    //     // console.log({...v})
    //     return {...v}
    //   })
    //   dispatch(setActivePositions(updateData))

    // } else {
    //   getPositionsList()
    // }
    
    getPositionsList()
  }, [getPositionsList])

  return (
    <>
    {contextHolder}
    <div className='positions mui-fl-btw'>
      <Tabs className='sty-positions-tabs' defaultActiveKey="active" items={tabsItems} onChange={onTabsChange} />
    </div>
    </>
  )
}
export default Positions;