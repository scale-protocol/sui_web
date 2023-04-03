import { Space, Table, Tabs, message } from 'antd';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ethos } from "ethos-connect";

import { closePosition } from './../utils/sui'
import './../assets/css/components/positions.css'
import API from "../api/api";
import { setActivePositions, setHistoryPositions } from './../store/action'


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
      dataIndex: 'formatID'
    },
    {
      title: 'Type',
      dataIndex: 'direction',
      key: 'type',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Leverage',
      dataIndex: 'leverage',
      key: 'leverage',
    },
    {
      title: 'Open',
      dataIndex: 'open_price',
      key: 'open',
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
    },
    {
      title: 'Margin',
      dataIndex: 'margin',
      key: 'margin',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Close {record.name}</a>
        </Space>
      ),
    },
  ];

  const historyColumns = [
    {
      title: 'Order',
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.order - b.order,
      key: 'order',
      dataIndex: 'formatID'
    },
    {
      title: 'Type',
      dataIndex: 'direction',
      key: 'type',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Leverage',
      dataIndex: 'leverage',
      key: 'leverage',
    },
    {
      title: 'Close Price',
      dataIndex: 'close_price',
      key: 'close',
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
    },
    {
      title: 'Status',
      // dataIndex: 'margin',
      key: 'margin',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Close {record.name}</a>
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
          onClick: () => handleClose(record)
        }
      }} />,
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
    API.getAccountPositions(tabActive, account).then(result => {
      if (tabActive === 'active') {
        dispatch(setActivePositions(result.data))
      }
      if (tabActive === 'history') {
        dispatch(setHistoryPositions(result.data))
      }
    });
  }, [account, dispatch, tabActive])

  const handleClose = useCallback(async (record) => {
    try {
      const rp = await closePosition(wallet, account, record.id)
      if (rp.confirmedLocalExecution) {
        messageApi.open({
          type: 'success',
          content: 'Close Position successful.'
        })
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
  }, [account, messageApi, wallet])

  useEffect(() => {
    getPositionsList()
  }, [getPositionsList])

  return (
    <>
    {contextHolder}
    <div className='positions'>
      <Tabs className='sty-positions-tabs' defaultActiveKey="active" items={tabsItems} onChange={onTabsChange} />
    </div>
    </>
  )
}
export default Positions;