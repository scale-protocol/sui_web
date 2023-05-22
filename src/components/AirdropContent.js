import { JsonRpcProvider, Connection } from '@mysten/sui.js'
import { ConnectButton, useAccountBalance, useWallet, SuiMainnetChain } from "@suiet/wallet-kit";
import React, { useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { Button, message } from 'antd'
import BigNumber from 'bignumber.js'

import { setAccount, setBalanceList } from './../store/action'
import { formatAddress } from './../utils/filter'
import { PACKAGE_OBJECTID, CONIN_PACKAGE_OBJECTID } from './../utils/token'
import { airdrop } from './../utils/sui'

import './../assets/css/components/airdrop-content.css'
import scaleTxtImg from './../assets/img/scale-txt.png'
import airdropStep1 from './../assets/img/airdrop-01.png'
import airdropStep2 from './../assets/img/airdrop-02.png'
import airdropStep3 from './../assets/img/airdrop-03.png'

const BN = BigNumber.clone({ ROUNDING_MODE: 1, DECIMAL_PLACES: 9 })
const BIG_TEN = new BigNumber(10)


function AirdropContent() {
  const [messageApi, contextHolder] = message.useMessage()
  const wallet01 = useWallet()
  const { balance } = useAccountBalance()
  const dispatch = useDispatch();

  const [step, setStep] = useState(1)
  const [address, setAddress] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)
  const [suiBtnLoading, setSuiBtnLoading] = useState(false)
  const [scaleBalance, setScaleBalance] = useState('')

  const balanceListRef = useRef([]);
  
  const getBalanceList01 = async () => {
    const fullnodeProvider = new JsonRpcProvider(new Connection({
      fullnode: wallet01.chain.rpcUrl
    }))

    // 存 balanceList
    let [scaleRP, suiRP] = await Promise.all([
      fullnodeProvider.getCoins({
        owner: wallet01.address,
        coinType: `${CONIN_PACKAGE_OBJECTID}::scale::SCALE`
      }),
      fullnodeProvider.getCoins({
        owner: wallet01.address,
        coinType: `0x2::sui::SUI`
      })
    ])

    let scaleBalance = 0
    scaleRP.data.forEach(v => {
      scaleBalance = scaleBalance - 0 + (v.balance - 0)
    })
    setScaleBalance(scaleBalance)
    scaleRP = {
      ...scaleRP,
      symbol: 'SCALE',
      formateBalance: new BN(scaleBalance).dividedBy(BIG_TEN.pow(6)).toString(10)
    }
    suiRP = {
      ...suiRP,
      symbol: 'Sui',
      formateBalance: new BN(balance).dividedBy(BIG_TEN.pow(9)).toString(10)
    }
    const balanceList = [suiRP, scaleRP]
    dispatch(setBalanceList(JSON.stringify(balanceList) || '[]')) // 存 balanceList
  }

  useEffect(() => {
    if (wallet01.connected) {
      if (wallet01.chain.id !== SuiMainnetChain.id) {
        wallet01.disconnect()
        messageApi.open({
          type: 'warning',
          content: 'Please switch your wallet to mainnet',
          style: {
            marginTop: 77
          }
        })
        return
      }
      setAddress(wallet01?.address)
      getBalanceList01()
    }

    if (address) {
      setStep(2);
    }
  }, [address, wallet01, getBalanceList01]);

  
  const claimScale = async () => {
    if (!wallet01 && !address) return
    setBtnLoading(true)
    try {
      // const suiObjectIds = getTokenObjectIds(JSON.stringify(balanceList), 'SUI')
      const rp = await airdrop(wallet01)
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
                    <ConnectButton className="sty-airdrop-button connect-wallet ant-btn ant-btn-primary mui-fl-central">
                      Connect Wallet
                    </ConnectButton>
                }
              </div>
            </li>
            <li className='mui-fl-col mui-fl-btw'>
              <p>After Connect your wallet, please claim your test tokens to participate in the event</p>
              <div className="mui-fl-vert">
                {/* <Button size='large' shape="round" disabled={step === 1} type="primary" className='mui-shr-0 sty-airdrop-button mui-fl-central claim-sui' loading={suiBtnLoading} onClick={claimSUI}>
                  <span className="mui-fl-central">
                    <i className="mico-sui"></i>
                    Claim SUI(test)
                  </span>
                </Button> */}
                <Button size='large' shape="round" disabled={step === 1} type="primary" className='mui-shr-0 sty-airdrop-button mui-fl-central' loading={btnLoading} onClick={claimScale}>
                  <span className="mui-fl-central">
                    <i className="mico-scale"></i>
                    Claim Scale
                  </span>
                </Button>
              </div>
            </li>
            <li className='mui-fl-col mui-fl-btw'>
              <p>Once you've collected it, come and start your trading!</p>
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