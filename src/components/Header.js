import { ethos, SignInButton } from "ethos-connect";
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js'
import { Modal, Input, message } from 'antd';

import API from "../api/api";
import { setAccount, setAddress, setWallet, setBalanceList, setProvider, setUserInfo } from './../store/action'
import { formatAddress, getTokenObjectIds } from './../utils/filter'
import { PACKAGE_OBJECTID } from './../utils/token'
import { deposit, withdraw, createAccount } from './../utils/sui'
import './../assets/css/components/header.css'

const BN = BigNumber.clone({ ROUNDING_MODE: 1, DECIMAL_PLACES: 9 })
const BIG_TEN = new BigNumber(10)

function Header() {
  const [messageApi, contextHolder] = message.useMessage()
  const { status, wallet, provider } = ethos.useWallet();
  const dispatch = useDispatch();

  const accountModule = useSelector(state => state.accountModule)
  const address = accountModule.address;
  const account = accountModule.account;
  const providerValue = accountModule.provider;
  const storeBalanceList = accountModule.balanceList;
  const userInfo = useSelector(state => state.userInfo)

  const [scaleBalance, setScaleBalance] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalActive, setModalActive] = useState('')
  const [inputValue, setInputValue] = useState('');


  const createAccountFun = useCallback(async () => {
    console.log('storeBalanceList', storeBalanceList)
    if (storeBalanceList.length === 0) return
    const scaleObjectIds = getTokenObjectIds(storeBalanceList || '[]', 'SCALE')
    if (scaleObjectIds.length === 0) {
      // console.log('Your scale token balance is 0, Please airdrop!')
      messageApi.open({
        type: 'warning',
        content: 'you need Sui Token to creat your margin account'
      })
      return
    }

    const rp = await createAccount(wallet, scaleObjectIds[0])
    if (rp.effects.status.status === 'success') {
      messageApi.open({
        type: 'success',
        content: 'Create Account Successful!'
      })
    } else {
      messageApi.open({
        type: 'warning',
        content: 'Create Account fail, Please try again later'
      })
    }
  }, [messageApi, storeBalanceList, wallet])

  useEffect(() => {
    if (wallet && status === 'connected') {
      dispatch(setAddress(wallet?.address || ''))  // 存 address
      dispatch(setWallet(JSON.parse(JSON.stringify(wallet) || null)))  // 存 wallet
      dispatch(setProvider(provider.connection.fullnode || ''))

      const { objects } = wallet?.contents || { objects: [] }
      objects.forEach((v) => {
        if (v.type === `${PACKAGE_OBJECTID}::account::UserAccount`) {
          dispatch(setAccount(v.extraFields.account_id || ''))  // 存 account
        }
      })
      console.log('account, ', account)
      
      if (!account) {
        createAccountFun()
      }
      
      // 存储 balanceList
      const balanceList = []
      const { tokens } = wallet?.contents || { tokens: {} }
      Object.keys(tokens).forEach(async (v) => {
        const obj = tokens[v]
        const symbol = v.substring(v.lastIndexOf(':') + 1)
        let tokenInfo
        try {
          tokenInfo = await providerValue.getCoinMetadata(v)
        } catch (e) {
          tokenInfo = { decimals: 0, symbol }
        }
        if (symbol === 'SUI') {
          balanceList.unshift({
            symbol,
            balance: obj.balance.toString(10),
            formateBalance: new BN(obj.balance.toString(10)).dividedBy(BIG_TEN.pow(tokenInfo.decimals)).toString(10),
            coins: obj.coins.sort((a, b) => { return b.balance - a.balance })
          })
        } else {
          balanceList.push({
            symbol,
            balance: obj.balance.toString(10),
            formateBalance: new BN(obj.balance.toString(10)).dividedBy(BIG_TEN.pow(tokenInfo.decimals)).toString(10),
            coins: obj.coins.sort((a, b) => { return b.balance - a.balance })
          })
        }
        dispatch(setBalanceList(JSON.stringify(balanceList) || '[]')) // 存 balanceList

        balanceList.forEach(v => {
          if (v.symbol === 'SCALE') {
            setScaleBalance(v.formateBalance)
          }
        })
      })
    }
    
    
    if (account) {
      API.getAccountInfo(account).then(result => {
        console.log('result', result)
        dispatch(setUserInfo(result.data));
      });
    }
  }, [address, dispatch, provider, providerValue, status, wallet, scaleBalance, storeBalanceList, account, createAccountFun])

  const handleOk = async () => {
    if (!account) {
      messageApi.open({
        type: 'warning',
        content: 'you need Sui Token to creat your margin account!'
      })
      return
    }
    const formatAmount = (new BigNumber(inputValue).times(BIG_TEN.pow(6))).toString(10)
    const scaleObjectIds = getTokenObjectIds(storeBalanceList || '[]', 'SCALE').slice(0, 1)
    if (modalActive === 'deposit') {
      const rp = await deposit(wallet, account, formatAmount, scaleObjectIds)
      if (rp.confirmedLocalExecution) {
        messageApi.open({
          type: 'success',
          content: 'Deposit Successful!'
        })
      } else {
        messageApi.open({
          type: 'warning',
          content: 'Deposit fail, Please try again later.'
        })
      }
    } else if (modalActive === 'withdraw') {
      const rp = await withdraw(wallet, account, formatAmount)
      if (rp.effects.status.status === 'success') {
        messageApi.open({
          type: 'success',
          content: 'Withdraw Successful!'
        })
      } else {
        messageApi.open({
          type: 'warning',
          content: 'Withdraw fail, Please try again later'
        })
      }
    }
    setIsModalOpen(false);
    setInputValue('')
  };
  
  const handleCancel = () => {
    setIsModalOpen(false);
    setInputValue('')
  };

  const openModal = useCallback((type) => {
    setIsModalOpen(() => true)
    setModalActive(() => type)
  }, [])

  const handleInput = (e) => {
    let value = e.target.value;
    const pattern = /^[0-9]*$/;
    if (!pattern.test(value)) {
      value = value.replace(/[^0-9]/g, '');
      e.target.value = value;
    }
    setInputValue(e.target.value);
  };

  // const content = (
  //   <div>
  //     <p>{formatAddress(address)}</p>
  //     <p>Content</p>
  //   </div>
  // );
  // const text = <span>Title</span>;
  

  return (
    <>
    {contextHolder}
    <div className="mui-header">
      <div className="section mui-fl-vert mui-fl-btw">
        <div className="mui-fl-vert">
          <p className="logo"></p>
          {address &&
            <div className="account-info mui-fl-vert">
              <p className="title mui-fl-vert taplight2">
                <span>Account</span>
                <i className="mico-arrow-right" />
              </p>
              <ul className="info mui-fl-vert">
                <li>
                  <p>Balance</p>
                  <p>$ {userInfo? userInfo.balance : '--'}</p>
                </li>
                <li>
                  <p>Margin</p>
                  <p>$ {userInfo? userInfo?.margin_total : '--'}</p>
                </li>
                <li>
                  <p>Margin Level</p>
                  <p>$ --</p>
                </li>
                <li className="condition mui-fl-vert">
                  <i className="mico-success"></i>
                  <span>Good Condition</span>
                </li>
              </ul>
              <div className="btns mui-fl-vert">
                <p className="taplight2" onClick={() => openModal('deposit')}>Deposit</p>
                <p></p>
                <p className="taplight2" onClick={() => openModal('withdraw')}>Withdraw</p>
              </div>
            </div>
          }
        </div>

        <div className="mui-fl-vert">
          <div className="global mui-fl-vert">
            <i className="mico-global"></i>
            <p className="mui-fl-vert taplight2" onClick={createAccountFun}>
              <span>US</span>
              <i className="mico-arrow-right" />
            </p>
          </div>
          <div>
            {!wallet ? (
              <SignInButton>
                <span className="connect-btn mui-fl-vert">
                  Connect
                  <i className="mico-arrow-right-white" />
                </span>
              </SignInButton>
            ) : (
              // <Popover placement="bottom" title={text} content={content} trigger="click">
                <div className="connect-btn address-btn mui-fl-vert taplight">
                  <span>{formatAddress(accountModule.address)}</span>
                  <i className="mico-arrow-right" />
                </div>
              // </Popover>
            )}
          </div>
        </div>
      </div>

      <Modal className="sty1-modal header-modal" width={386} okText='Confirm' title={modalActive === 'deposit' ? 'Deposit Margin' : 'Withdraw Margin'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p className="p1">
          {modalActive === 'deposit' ? 'From Wallet: ' : 'To Wallet: '}
          <span>{formatAddress(address)}</span>
        </p>
        <Input value={inputValue} onInput={handleInput} />
      </Modal>
    </div>
    </>
  );
}

export default Header;
