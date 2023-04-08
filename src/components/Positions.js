import { Space, Table, Tabs, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethos } from "ethos-connect";
// import BigNumber from 'bignumber.js'

import { closePosition } from './../utils/sui'
// import { formatTenDecimalNum, keepDecimal2 } from './../utils/filter'

import './../assets/css/components/positions.css'
// import API from "../api/api";

import { getPositionsListFun } from './../utils/positions'


function Positions() {
  const [messageApi, contextHolder] = message.useMessage()

  const { wallet } = ethos.useWallet();
  const accountModule = useSelector(state => state.accountModule)
  const account = accountModule.account;
  const [tabActive, setTabActive] = useState('active')
  const priceMap = useSelector(state => state.wsModule.wsPrice)

  const positionsModule = useSelector(state => state.positionsModule)
  const activePositions = positionsModule.activePositions;
  const historyPositions = positionsModule.historyPositions;
  // const wsPositionUpdateData = positionsModule.wsPositionUpdateData;

  const dispatch = useDispatch();


  const activeColumns = [
    {
      title: 'Order',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order - b.order,
      key: 'order',
      dataIndex: 'formatID',
      width: 152
    },
    {
      title: 'Type',
      dataIndex: 'direction',
      key: 'type',
      width: 108
    },
    {
      title: 'Size',
      dataIndex: 'lot',
      key: 'size',
      width: 108
    },
    {
      title: 'Leverage',
      dataIndex: 'leverageFormat',
      key: 'leverage',
      width: 108
    },
    {
      title: 'Open',
      dataIndex: 'open_price',
      key: 'open',
      width: 152
    },
    {
      title: 'Latest',
      key: 'latest',
      width: 152,
      render: (_, record) => (
          <p>{ priceMap?.current_price_format }</p>
      ),
    },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      width: 152
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      key: 'margin',
      width: 110
    },
    {
      title: 'Action',
      key: 'action',
      width: 152,
      render: (_, record) => (
        <Space size="middle">
          <p onClick={() => handleActiveClose(record)}>
            <a>Close {record.name}</a>
          </p>
        </Space>
      ),
    }
  ];

  const historyColumns = [
    {
      title: 'Order',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order - b.order,
      key: 'order',
      dataIndex: 'formatID',
      width: 200
    },
    {
      title: 'Type',
      dataIndex: 'direction',
      key: 'type',
      width: 200
    },
    {
      title: 'Size',
      dataIndex: 'lot',
      key: 'size',
      width: 200
    },
    {
      title: 'Leverage',
      dataIndex: 'leverage',
      key: 'leverage',
      width: 200
    },
    {
      title: 'Close Price',
      dataIndex: 'close_price',
      key: 'close',
      width: 200
    },
    // {
    //   title: 'Latest',
    //   dataIndex: 'latest',
    //   key: 'latest',
    // },
    {
      title: 'Profit',
      dataIndex: 'profit',
      key: 'profit',
      width: 200
    },
    {
      title: 'Status',
      key: 'margin',
      width: 200,
      render: (_, record) => (
        <p>Closed</p>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <p onClick={() => handleHistoryView(record)}>
            <a>View {record.name}</a>
          </p>
        </Space>
      ),
    },
  ];

  const tabsItems = [
    {
      key: 'active',
      label: `Position`,
      children: <Table columns={activeColumns} dataSource={activePositions} />,
    },
    {
      key: 'history',
      label: `History`,
      children: <Table columns={historyColumns} dataSource={historyPositions} />,
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
      const rp = await closePosition(wallet, account, record.id)
      if (rp.confirmedLocalExecution) {
        messageApi.open({
          type: 'success',
          content: 'Close Position successful.'
        })
        setTimeout(() => {
          getPositionsListFun('active', account, dispatch)
          getPositionsListFun('history', account, dispatch)
        }, 3000)
      } else {
        messageApi.open({
          type: 'warning',
          content: 'Close Position fail, Please try again later.'
        })
      }
    } catch (e) {
      messageApi.open({
        type: 'error',
        content: e.message
      })
    }
  }, [account, dispatch, messageApi, wallet])

  const handleHistoryView = useCallback((record) => {
    // messageApi.open({
    //   type: 'warning',
    //   content: 'Comimg soon!'
    // })
    window.open(`https://explorer.sui.io/object/${record.id}?network=devnet`)
  }, [])

  useEffect(() => {
    getPositionsList()
    // const _activePositions = JSON.parse(JSON.stringify(activePositions))
    // _activePositions.forEach(v => {
    //   if (v.id === wsPositionUpdateData?.id) {
    //     v.profit = keepDecimal2((new BigNumber(wsPositionUpdateData.profit).times(formatTenDecimalNum(-6))).toString(10))
    //   }
    // })
    // setForActivePositions(_activePositions)
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