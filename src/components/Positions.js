import { Modal, Button, Space, Table, Tabs, message } from 'antd';
import { useCallback, useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from "@suiet/wallet-kit";
import BigNumber from 'bignumber.js'

import { closePosition } from './../utils/sui'
import './../assets/css/components/positions.css'
import { getPositionsListFun } from './../utils/positions'
import { formatNum, addPosNeg } from '../utils/filter';
import scaleImg from './../assets/img/scale.png'
import globalImg from './../assets/img/global.png'
// import close01Img from './../assets/img/01.png'
import closeLong from './../assets/img/close-posotion-bg1.png'
import closeShort from './../assets/img/close-posotion-bg2.png'

function Positions() {
  const [messageApi, contextHolder] = message.useMessage()
  const wallet01 = useWallet()

  // const { wallet } = ethos.useWallet();
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

  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [closeInfo, setCloseInfo] = useState({
    symbol_short: '',
    icon: '',
    leverageFormat: '',
    open_price: '',
    direction: '',
    close_price: '',
    profitP: ''
  });


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
          <p className={record.direction.toLocaleUpperCase() === 'SELL' ? 'red' : 'green'}>{ (record.direction).toLocaleUpperCase() === 'BUY' ? 'LONG' : 'SHORT' }</p>
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
          <Button className='posotion-list-close-btn' onClick={() => handleActiveClose(record, priceMap && priceMap[record.symbol]?.current_price)} type="primary" shape="round">Close</Button>
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
          <p className={record.direction.toLocaleUpperCase() === 'SELL' ? 'red' : 'green'}>{ (record.direction).toLocaleUpperCase() === 'BUY' ? 'LONG' : 'SHORT' }</p>
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

  const handleActiveClose = useCallback(async (record, price) => {
    try {
      const rp = await closePosition(wallet01, account, record.id, activeTradePair.id)
      if (rp.confirmedLocalExecution) {
        // messageApi.open({
        //   type: 'success',
        //   content: 'Close Position successful.',
        //   style: {
        //     marginTop: 77
        //   }
        // })
        setTimeout(() => {
          getPositionsListFun('active', account, dispatch)
          getPositionsListFun('history', account, dispatch)
        }, 3000)
        
        const closeBG = new BigNumber(price)
        const openBG = new BigNumber(record.open_price)
        const profitP = parseFloat(addPosNeg(closeBG.minus(openBG).dividedBy(openBG).times(100).toString(10), false))
        setCloseInfo({
          ...closeInfo,
          close_price: price,
          symbol_short: record.symbol_short,
          icon: record.icon,
          leverageFormat: record.leverageFormat,
          open_price: record.open_price,
          direction: record.direction,
          profitP: profitP
        })
        setIsModalOpen(true)
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
  }, [account, activeTradePair?.id, dispatch, messageApi, wallet01])

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

  const handleCancel = () => {
    setIsModalOpen(false)
  }

  const canvasRef = useRef(null);
  const closeBgImage = useRef(null);
  const handleOk = () => {
    console.log('closeInfo', closeInfo)
    setTimeout(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const background = document.getElementById('bg');
      ctx.drawImage(background, -10, -10, 362, 524);
      
      ctx.font = "bold 24px Arial";
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      // ctx.fillText('BTC-USD', 30, 90);
      ctx.fillText(closeInfo.symbol_short, 30, 90);
  
      ctx.fillStyle = closeInfo.direction === 'Sell' ? 'rgba(231, 100, 100, 0.1)' : 'rgba(65, 186, 99, 0.1)'; // 红色
      // ctx.fillStyle = 'red'; // 红色
      const radius = 12; // 圆角半径
      const x = 170, y = 67;  // 背景块左上角坐标
      const width = 60, height = 26;
      ctx.beginPath()
      ctx.moveTo(x + radius, y);
      ctx.arcTo(x + width, y, x + width, y + height, radius);
      ctx.arcTo(x + width, y + height, x, y + height, radius);
      ctx.arcTo(x, y + height, x, y, radius);
      ctx.arcTo(x, y, x + width, y, radius);
      ctx.closePath();
      ctx.fill();
  
      ctx.font = "16px Arial";
      ctx.fillStyle = closeInfo.direction === 'Sell' ? 'rgba(231, 100, 100, 1)' : "rgba(65, 186, 99, 1)";
      ctx.fillText(closeInfo.direction === 'Sell' ? 'Short' : 'Long', 183, 85);
  
      ctx.font = "16px Arial";
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillText(closeInfo.leverageFormat, 240, 86);
      // ctx.fillText('125X', 220, 86);
  
      ctx.font = "16px Arial";
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillText('Profit (%)', 30, 145);
  
      ctx.font = "bold 48px Arial";
      ctx.fillStyle = closeInfo.profitP > 0 ? "rgba(65, 186, 99, 1)" : 'rgba(231, 100, 100, 1)';
      // ctx.fillText('+105.45%', 30, 205);
      ctx.fillText((closeInfo.profitP > 0 ? '+' : '') + closeInfo.profitP + '%', 30, 205);
  
      
      ctx.font = "16px Arial";
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillText('open', 30, 263);
  
      ctx.font = "16px Arial";
      ctx.fillStyle = "rgba(0, 0, 0, 0.45)";
      ctx.fillText('close', 125, 263);
      
      ctx.font = "bold 16px Arial";
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      // ctx.fillText('$4235.47', 30, 285);
      ctx.fillText('$' + closeInfo.open_price, 30, 285);
  
      ctx.fillStyle = "rgba(0, 0, 0, 1)";
      // ctx.fillText('$4235.47', 125, 285);
      ctx.fillText('$' + closeInfo.close_price, 125, 285);
  
      const downloadLink = document.createElement("a");
      downloadLink.download = "image.png";
      downloadLink.href = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
      downloadLink.click();
      setIsModalOpen(false)
    }, 500)
  }
  const imageOnLoad = () => {
    setTimeout(() => {
      // const canvas = canvasRef.current;
      // const ctx = canvas.getContext("2d");
      // const background = document.getElementById('bg');
      // ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
      
      // ctx.font = "24px Arial";
      // ctx.fillStyle = "red";
      // ctx.fillText(closeInfo.symbol_short, 60, 24);
    }, 1500)
  }
  const imageOnloadError = (e) => {
    console.log(e)
    messageApi.open({
      type: 'error',
      content: 'Image failed to load!',
      style: {
        marginTop: 77
      }
    })
  }
  return (
    <>
    {contextHolder}
    <div className='positions mui-fl-btw'>
      <Tabs className='sty-positions-tabs' defaultActiveKey="active" items={tabsItems} onChange={onTabsChange} />
    </div>

    <Modal className="sty1-modal header-modal" centered width={586} open={isModalOpen}
      onCancel={handleCancel}
      footer={
        <div className='mui-fl-central'>
            <Button className='positions-btn1' shape="round" onClick={handleCancel}>Done</Button>
            <Button className='positions-btn2' shape="round" type="primary" onClick={handleOk}>Save image</Button>
          </div>
        }>
        <div className='mui-fl-col mui-fl-vert close-position'>
          <p className='title mui-fl-vert'><i className='icon-success'/>Successfully Closed</p>
          <div className='close-position-content mui-fl-col mui-fl-btw'>
            <div>
              <div className='mui-fl-vert position-info'>
                <img src={closeInfo.icon} alt='' />
                <p>{ closeInfo.symbol_short }</p>
                <p>{ closeInfo.direction === 'Sell' ? 'Short' : 'Long' }</p>
                <p>{ closeInfo.leverageFormat }</p>
              </div>

              <div className='mui-fl-col position-profit'>
                <p>Profit (%)</p>
                <p className={closeInfo.profitP > 0 ? 'green' : 'red'}>{ closeInfo.profitP }%</p>
              </div>

              <ul className='position-price mui-fl-vert'>
                <li className='mui-fl-col'>
                  <p>Open</p>
                  <p>${ closeInfo.open_price }</p>
                </li>
                <li className='mui-fl-col'>
                  <p>Close</p>
                  <p>${ closeInfo.close_price }</p>
                </li>
              </ul>
            </div>
            <div className='position-offical'>
              <img src={scaleImg} alt='' />
              <p className='mui-fl-vert'>
                <img src={ globalImg } alt='' />
                <a href="https://scale.exchange" target='_blank' rel="noreferrer">https://scale.exchange</a>
              </p>
            </div>
          </div>
          <div className='canvas-wrap'>
            <canvas ref={canvasRef} width="342" height="504"></canvas>
            isModalOpen ? <img ref={closeBgImage} src={closeInfo.direction === 'Sell' ? closeShort : closeLong} width={362} height={524} alt='' id="bg" onLoad={() => imageOnLoad()} onError={() => imageOnloadError()} /> : ''
          </div>
        </div>
      </Modal>
    </>
  )
}
export default Positions;