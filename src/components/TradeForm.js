import BigNumber from 'bignumber.js'
import { useDispatch, useSelector } from 'react-redux';
import { ethos, SignInButton } from "ethos-connect";
import { getTokenObjectIds, formatAddress, formatTenDecimalNum, keepDecimal2, addPosNeg } from './../utils/filter'
import { openPosition, createAccount } from './../utils/sui'
import { getPositionsListFun } from './../utils/positions'
import { Button, Form, InputNumber, message, Modal } from 'antd';
import './../assets/css/components/trade-form.css'
import { useEffect, useState } from 'react';
import warningImg from './../assets/img/warning.png'
import { PACKAGE_OBJECTID } from './../utils/token'
import { setAccount } from './../store/action'

function TradeForm() {
  const { wallet } = ethos.useWallet();
  
  const [messageApi, contextHolder] = message.useMessage()

  const [form] = Form.useForm();
  const account = useSelector(state => state.accountModule.account);
  const address = useSelector(state => state.accountModule.address);
  const activeTradePair = useSelector(state => state.activeTradePair);
  const priceMap = useSelector(state => state.wsModule.wsPrice)
  const spreadMap = useSelector(state => state.spreadModule.spreadMap)
  const halfSpread = spreadMap && (new BigNumber(spreadMap[activeTradePair?.id]?.spread).dividedBy(2))

  const accountModule = useSelector(state => state.accountModule)
  const storeBalanceList = accountModule.balanceList;

  const dispatch = useDispatch();
  const [margin, setMargin] = useState('0.00')
  const [spread, setSpread] = useState(0)
  const [tradeType, setTradeType] = useState('buy')

  const [btnDisabled, setBtnDisabled] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  const [isAirdropModalOpen, setIsAirdropModalOpen] = useState(false);

  const handleClkTrade = async (type) => {
    if (!account) {
      setIsCreateModalOpen(true)
      return
    }
    setTradeType(type)
    const values = form.getFieldsValue();
    const formatSize = (new BigNumber(values.size).times(formatTenDecimalNum(4))).toString(10)
    const rp = await openPosition(wallet, account, formatSize, values.leverage.toString(), 1, type === 'sell' ? 2 : 1, activeTradePair.id)
    if (rp.confirmedLocalExecution) {
      // messageApi.open({
      //   type: 'success',
      //   content: 'Open Position Successful!'
      // })
      setIsModalOpen(true)
      setTimeout(() => {
        getPositionsListFun('active', account, dispatch)
      }, 3000)
      
    } else {
      messageApi.open({
        type: 'warning',
        content: 'Open Position fail, Please try again later.',
        style: {
          marginTop: 77
        }
      })
    }
  }

  const handleIpt = () => {
    const values = form.getFieldsValue();
    
    if (values.size && values.leverage) {
      const _margin = keepDecimal2(new BigNumber(values.size).times(new BigNumber(priceMap[activeTradePair.symbol]?.current_price)).dividedBy(new BigNumber(values.leverage))).toString(10)
      const _spread = keepDecimal2(new BigNumber(values.size).times(new BigNumber(halfSpread)).dividedBy(values.leverage)).toString(10)
      setMargin(_margin)
      setSpread(_spread)
      setBtnDisabled(false)
    }  else {
      setBtnDisabled(true)
      setMargin('0.00')
      setSpread(0)
    }
  }

  const handleOk = () => {
    setIsModalOpen(false)
    form.resetFields()
  }

  const handleCreateOk = async () => {
    if (storeBalanceList.length === 0) {
      messageApi.open({
        type: 'warning',
        content: 'you need Sui Token to creat your margin account',
        style: {
          marginTop: 77
        }
      })
      return
    }
    const scaleObjectIds = getTokenObjectIds(storeBalanceList || '[]', 'SCALE')
    if (scaleObjectIds.length === 0) {
      // messageApi.open({
      //   type: 'warning',
      //   content: 'you need Scale test token',
      //   style: {
      //     marginTop: 77
      //   }
      // })
      setIsAirdropModalOpen(true)
      return
    }
    const rp = await createAccount(wallet, scaleObjectIds[0])
    if (rp.confirmedLocalExecution) {
      messageApi.open({
        type: 'success',
        content: 'Create Account Successful!',
        style: {
          marginTop: 77
        }
      })
      // console.log('wallet', wallet)
      setTimeout(() => {
        const { objects } = wallet?.contents || { objects: [] }
        objects.forEach((v) => {
          if (v.type === `${PACKAGE_OBJECTID}::account::UserAccount`) {
            dispatch(setAccount(v.extraFields.account_id || ''))  // 存 account
          }
        })
        // console.log('wallet', wallet)
        setIsCreateModalOpen(false)
      }, 2000)
    } else {
      messageApi.open({
        type: 'warning',
        content: 'Create Account fail, Please try again later',
        style: {
          marginTop: 77
        }
      })
    }
  }

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false)
  }

  useEffect(() => {
    const values = form.getFieldsValue();
    if (values.size && values.leverage) {
      const _margin = keepDecimal2(new BigNumber(values.size).times(new BigNumber(priceMap[activeTradePair.symbol]?.current_price)).dividedBy(new BigNumber(values.leverage))).toString(10)
      setMargin(_margin)
    }
  }, [activeTradePair, form, priceMap])


  return (
    <>
    {contextHolder}
    <div className='trade-form mui-fl-col mui-fl-btw'>
      <p className='trade-form-title mui-fl-shr-0'>Market</p>
      <Form
        form={form}
        className='sty-trade-form mui-fl-1 mui-fl-col mui-fl-btw'
        layout="vertical "
        name="basic"
        style={{ maxWidth: 600 }}
      >
        <div>
          <Form.Item
            label="Size"
            name="size"
          >
            <InputNumber min={0.1} step={0.01} onInput={handleIpt} placeholder='0.00' />
          </Form.Item>

          <Form.Item
            label="Leverage"
            name="leverage"
          >
            <InputNumber min={1} step={1} max={125} onInput={handleIpt} placeholder='1-125X'/>
          </Form.Item>
          <div className='mui-fl-vert mui-fl-btw'>
            <p>Margin</p>
            <p>${ margin } <span>(±{ spread })</span> </p>
          </div>
        </div>

        <p className='trade-form-gas'>
          Please confirm that you have enough Sui for gas.
        </p>
          {address ? 
          <div className='mui-fl-vert trade-form-btns'>
            <Button className='trade-form-btn red-bg' disabled={btnDisabled} type="primary" htmlType="button" onClick={() =>handleClkTrade('sell')}>
              Short <br></br> { addPosNeg(new BigNumber(priceMap && priceMap[activeTradePair.symbol]?.current_price).minus(new BigNumber(halfSpread)).toString(10), false, activeTradePair?.point || 2) }
            </Button>
            <p className='trade-form-rate'>{ spreadMap && Math.ceil(spreadMap[activeTradePair?.id]?.spread) }</p>
            <Button className='trade-form-btn green-bg' disabled={btnDisabled} type="primary" htmlType="button" onClick={() => handleClkTrade('buy')}>
              Long <br></br> { addPosNeg(new BigNumber(priceMap && priceMap[activeTradePair.symbol]?.current_price).plus(new BigNumber(halfSpread)).toString(10), false, activeTradePair?.point || 2) }
            </Button>
          </div>
          :
          <SignInButton>
            <span className="connect-btn big mui-fl-central">
              Connect
            </span>
          </SignInButton>
          }
      </Form>
    </div>
    

    <Modal className="sty1-modal header-modal" centered width={386}  open={isModalOpen} footer={[]} closable={false}>
      <div className='trade-openposi-success mui-fl-col mui-fl-vert'>
        <i className="mico-success-2"></i>
        <p className='title'>Successfully Opened</p>
        <div className='trade-info'>
          <p className='pair mui-fl-vert'>
            <img src={activeTradePair?.icon} alt='' />
            <span className='s1'>{ activeTradePair?.symbol_short }</span>
            <span className={`s2 ${tradeType}`}>{ tradeType.toLocaleUpperCase() === 'BUY' ? 'LONG' : 'SHORT' }</span>
          </p>
          <ul className='mui-fl-vert'>
            <li className='mui-fl-1'>
              <p>Size</p>
              <p>{ form.getFieldsValue().size }</p>
            </li>
            <li className='mui-fl-1'>
              <p>Leverage</p>
              <p>{ form.getFieldsValue().leverage }X</p>
            </li>
            <li className='mui-fl-1'>
              <p>Margin</p>
              <p>${ margin } <span>(±{ spread })</span> </p>
            </li>
          </ul>
        </div>

        {/* <div className='sui-exploeer mui-fl-vert taplight2'>
          <p>Sui Explorer</p>
          <i className='mico-share' />
        </div> */}

        <Button className="trade-openposi-success-done" type="primary" size='large' shape="round" onClick={() => handleOk()}>
            DONE
        </Button>
      </div>
    </Modal>

    <Modal className="sty1-modal header-modal" centered width={386} okText='Create Now' open={isCreateModalOpen}  footer={
      <div className='mui-fl-central'>
        <Button className='positions-btn1' shape="round" onClick={handleCreateCancel}>Cancel</Button>
        <Button className='positions-btn2' shape="round" type="primary" onClick={handleCreateOk}>Create Now</Button>
      </div>} onOk={handleCreateOk} onCancel={handleCreateCancel}>
      <div className='trade-create-now mui-fl-col mui-fl-vert'>
        <img src={warningImg} alt='' />
        <p className='title'>Create account to trading</p>
        <p className='tip1'>No margin account has been created with Wallet {formatAddress(address)}. </p>
        <p className='tip1'>You can create now and start trading.</p>
      </div>
      </Modal>

      
      <Modal open={isAirdropModalOpen} title="Warning" className="sty2-modal" onOk={() => setIsAirdropModalOpen(false)} onCancel={() => setIsAirdropModalOpen(false)}>
          You need testUSD，please claim at <a href="/airdrop">{window.location.origin + '/airdrop'}</a>
        </Modal>
    </>
  )
}

export default TradeForm;