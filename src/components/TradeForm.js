import BigNumber from 'bignumber.js'
import { useSelector } from 'react-redux';
import { ethos, SignInButton } from "ethos-connect";
import { formatTenDecimalNum } from './../utils/filter'
import { openPosition } from './../utils/sui'
import { Button, Form, InputNumber, message } from 'antd';
import './../assets/css/components/trade-form.css'

function TradeForm() {
  const { wallet } = ethos.useWallet();
  const [messageApi, contextHolder] = message.useMessage()

  const [form] = Form.useForm();
  const account = useSelector(state => state.accountModule.account);
  const address = useSelector(state => state.accountModule.address);

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
    const rp = await openPosition(wallet, account, formatSize, values.leverage, 1, type === 'sell' ? 2 : 1)
    if (rp.effects.status.status === 'success') {
      messageApi.open({
        type: 'success',
        content: 'Open Position Successful!'
      })
    } else {
      messageApi.open({
        type: 'warning',
        content: 'Open Position fail, Please try again later.'
      })
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
        initialValues={{ size: 0.1, leverage: 10 }}
      >
        <div>
          <Form.Item
            label="Size"
            name="size"
          >
            <InputNumber min={0.1} step={0.1}/>
          </Form.Item>

          <Form.Item
            label="Leverage"
            name="leverage"
          >
            <InputNumber min={1} step={1} />
          </Form.Item>
          <div className='mui-fl-vert mui-fl-btw'>
            <p>Margin</p>
            <p>--</p>
          </div>
        </div>

        <p className='trade-form-gas'>
          Gas fee 
          <span> 0.000005 SUI</span>
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