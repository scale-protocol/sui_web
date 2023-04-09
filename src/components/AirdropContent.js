import { ethos, SignInButton } from "ethos-connect";
import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom';
import { Button, message } from 'antd'
import { getTokenObjectIds, formatAddress } from './../utils/filter'

import { airdrop } from './../utils/sui'
import './../assets/css/components/airdrop-content.css'
import scaleTxtImg from './../assets/img/scale-txt.png'
import airdropStep1 from './../assets/img/airdrop-01.png'
import airdropStep2 from './../assets/img/airdrop-02.png'
import airdropStep3 from './../assets/img/airdrop-03.png'


function AirdropContent() {
  const [messageApi, contextHolder] = message.useMessage()

  const { wallet } = ethos.useWallet();
  const [step, setStep] = useState(1)
  const [address, setAddress] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [suiBtnLoading, setSuiBtnLoading] = useState(false)
  const [scaleBalance, setScaleBalance] = useState('')

  const balanceListRef = useRef([]);
  useEffect(() => {
    setAddress(wallet?.address)

    const { tokens } = wallet?.contents || { tokens: {} };
    const _balanceList = Object.keys(tokens).map(v => {
      const obj = tokens[v];
      const symbol = v.substring(v.lastIndexOf(':') + 1);
      if (symbol === 'SCALE') {
        setScaleBalance(obj.balance.toString(10))
      }
      return {
        symbol,
        balance: obj.balance.toString(10),
        coins: obj.coins.sort((a, b) => { return b.balance - a.balance }),
      };
    });
    if (address) {
      setStep(2);
    }
    balanceListRef.current = _balanceList;
  }, [address, scaleBalance, wallet]);

  const balanceList = balanceListRef.current;

  const claimSUI = async () => {
    if (!wallet) return;
    setSuiBtnLoading(true)
    try {
      await ethos.dripSui({ address: wallet.address });
      messageApi.open({
        type: 'success',
        content: 'Claim SUI successful.',
        style: {
          marginTop: 77
        }
      })
    } catch (e) {
      messageApi.open({
        type: 'warning',
        content: 'Too many requests Please try again later.',
        style: {
          marginTop: 77
        }
      })
    }
    setSuiBtnLoading(false)
  }

  const claimScale = async () => {
    if (!wallet && !address) return
    setBtnLoading(true)
    try {
      const suiObjectIds = getTokenObjectIds(JSON.stringify(balanceList), 'SUI')
      const rp = await airdrop(wallet, suiObjectIds.slice(0, 1))
      if (rp?.confirmedLocalExecution) {
        messageApi.open({
          type: 'success',
          content: 'Airdrop Successful!',
          style: {
            marginTop: 77
          }
        })
      } else {
        messageApi.open({
          type: 'warning',
          content: 'Airdrop fail, Please try again later!',
          style: {
            marginTop: 77
          }
        })
      }
    } catch (e) {
      console.log(e)
      
      messageApi.open({
        type: 'warning',
        content: 'Airdrop fail, Please try again later!',
        style: {
          marginTop: 77
        }
      })
    }
    setBtnLoading(false)
  }
  return (
    <>
      {contextHolder}
      <div className="airdrop-content mui-fl-col">
        <div className='mui-fl-central airdrop-title'>
          <p>Welcome to the</p>
          <img src={scaleTxtImg} alt='scale' />
        </div>

        <div className='mui-fl-vert'>
          <div className='airdrop-step-list mui-fl-col mui-shr-0'>
            <img src={airdropStep1} alt='scale' />
            <img src={airdropStep2} alt='scale' />
            <img src={airdropStep3} alt='scale' />
          </div>
          <ul className='mui-fl-1 airdrop-step-content'>
            <li className='mui-fl-col mui-fl-btw'>
              <p>First you need to access your sui blockchain wallet, if you have never used one before, please follow the instructions to create one</p>
              <div>
                {
                  address ?
                    <Button className="sty-airdrop-button connect-wallet" size='large' shape="round" disabled>
                      <span className="mui-fl-central">
                        <i className="mico-success-1"></i>
                        { formatAddress(address) }
                      </span>
                    </Button> :
                    <SignInButton>
                      <p className="sty-airdrop-button connect-wallet ant-btn ant-btn-primary mui-fl-central">
                        Connect Wallet
                      </p>
                    </SignInButton>
                }
              </div>
            </li>
            <li className='mui-fl-col mui-fl-btw'>
              <p>After Connect your wallet, please claim your test tokens to participate in the event</p>
              <div className="mui-fl-vert">
                <Button size='large' shape="round" disabled={step === 1} type="primary" className='mui-shr-0 sty-airdrop-button mui-fl-central claim-sui' loading={suiBtnLoading} onClick={claimSUI}>
                  <span className="mui-fl-central">
                    <i className="mico-sui"></i>
                    Claim SUI(test)
                  </span>
                </Button>
                <Button size='large' shape="round" disabled={step === 1} type="primary" className='mui-shr-0 sty-airdrop-button mui-fl-central claim-scale' loading={btnLoading} onClick={claimScale}>
                  <span className="mui-fl-central">
                    <i className="mico-scale"></i>
                    Claim Scale
                  </span>
                </Button>
              </div>
            </li>
            <li className='mui-fl-col mui-fl-btw'>
              <p>Once you've collected it, come and start your trading！</p>
              <div>
                {
                  scaleBalance ? 
                  <Link to="/">
                    <Button size='large' shape="round" type="primary" className='mui-shr-0 sty-airdrop-button connect-wallet'>
                      Go Trading
                    </Button> 
                  </Link>
                  : 
                  <Button size='large' shape="round" type="primary" className='mui-shr-0 sty-airdrop-button connect-wallet' disabled>
                    Go Trading
                  </Button>
                }
              </div>
            </li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default AirdropContent