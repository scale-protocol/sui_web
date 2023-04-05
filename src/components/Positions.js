import { Space, Table, Tabs, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethos } from "ethos-connect";

import { closePosition } from './../utils/sui'
import './../assets/css/components/positions.css'
// import API from "../api/api";

import { getPositionsListFun } from './../utils/positions'


function Positions() {
  const [messageApi, contextHolder] = message.useMessage()

  const { wallet } = ethos.useWallet();
  const accountModule = useSelector(state => state.accountModule)
  const account = accountModule.account;
  const [tabActive, setTabActive] = useState('active')

  const positionsModule = useSelector(state => state.positionsModule)
  const activePositions = positionsModule.activePositions;
  const historyPositions = positionsModule.historyPositions;
  // console.log('activePositions', activePositions)
  // console.log('historyPositions', historyPositions)

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
      dataIndex: 'latest',
      key: 'latest',
      width: 152
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
          <a>Close {record.name}</a>
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
      dataIndex: 'size',
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
          <a>View {record.name}</a>
        </Space>
      ),
    },
  ];

  const tabsItems = [
    {
      key: 'active',
      label: `Position`,
      children: <Table columns={activeColumns} dataSource={activePositions} onRow={(record) => {
        return {
          onClick: () => handleActiveClose(record)
        }
      }} />,
    },
    {
      key: 'history',
      label: `History`,
      children: <Table columns={historyColumns} dataSource={historyPositions} onRow={(record) => {
        return {
          onClick: () => handleHistoryClose(record)
        }
      }} />,
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

  const handleHistoryClose = useCallback(() => {
    messageApi.open({
      type: 'warning',
      content: 'Comimg soon!'
    })
  }, [messageApi])

  useEffect(() => {
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