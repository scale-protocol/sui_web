import BigNumber from 'bignumber.js'
import { useDispatch, useSelector } from 'react-redux';
import { ethos, SignInButton } from "ethos-connect";
import { formatTenDecimalNum, keepDecimal2 } from './../utils/filter'
import { openPosition } from './../utils/sui'
import { getPositionsListFun } from './../utils/positions'
import { Button, Form, InputNumber, message } from 'antd';
import './../assets/css/components/trade-form.css'
import { useState } from 'react';

function TradeForm() {
  const { wallet } = ethos.useWallet();
  const [messageApi, contextHolder] = message.useMessage()

  const [form] = Form.useForm();
  const account = useSelector(state => state.accountModule.account);
  const address = useSelector(state => state.accountModule.address);

  const priceMap = useSelector(state => state.wsModule.wsPrice)

  const dispatch = useDispatch();
  const [margin, setMargin] = useState('0.00')
  const [spread, setSpread] = useState(0)

  const handleClkTrade = async (type) => {
    if (!account) {
      messageApi.open({
        type: 'warning',
        content: 'you need Sui Token to creat your margin account!'
      })
      return
    }
    const values = form.getFieldsValue();
    const formatSize = (new BigNumber(values.size).times(formatTenDecimalNum(4))).toString(10)
    const rp = await openPosition(wallet, account, formatSize, values.leverage.toString(), 1, type === 'sell' ? 2 : 1)
    if (rp.confirmedLocalExecution) {
      messageApi.open({
        type: 'success',
        content: 'Open Position Successful!'
      })
      setTimeout(() => {
        getPositionsListFun('active', account, dispatch)
      }, 3000)
    } else {
      messageApi.open({
        type: 'warning',
        content: 'Open Position fail, Please try again later.'
      })
    }
  }

  const handleIpt = () => {
    const values = form.getFieldsValue();
    if (values.size && values.leverage) {
      const _margin = keepDecimal2(new BigNumber(values.size).times(new BigNumber(priceMap?.current_price)).dividedBy(values.leverage)).toString(10)
      const _spread = keepDecimal2(new BigNumber(values.size).times(new BigNumber(40)).dividedBy(values.leverage)).toString(10)
      setMargin(_margin)
      setSpread(_spread)
    }
  }


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
            <Button className='trade-form-btn red-bg' type="primary" htmlType="button" onClick={() =>handleClkTrade('sell')}>
              Sell
            </Button>
            <p className='trade-form-rate'>20</p>
            <Button className='trade-form-btn green-bg' type="primary" htmlType="button" onClick={() => handleClkTrade('buy')}>
              Buy
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
    </>
  )
}

export default TradeForm;