import { ethos, SignInButton } from "ethos-connect";
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js'
import { Modal, Input, message, Popover } from 'antd';
import { JsonRpcProvider } from '@mysten/sui.js'

import API from "../api/api";
import { setAccount, setAddress, setWallet, setBalanceList, setProvider, setUserInfo } from './../store/action'
import { formatAddress, getTokenObjectIds, keepDecimal2, formatNum } from './../utils/filter'
import { PACKAGE_OBJECTID } from './../utils/token'
import { deposit, withdraw, createAccount } from './../utils/sui'
import './../assets/css/components/header.css'

const BN = BigNumber.clone({ ROUNDING_MODE: 1, DECIMAL_PLACES: 9 })
const BIG_TEN = new BigNumber(10)
function Header() {
  const [messageApi, contextHolder] = message.useMessage()
  const { status, wallet, provider } = ethos.useWallet();
  // console.log('wallet', wallet)
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
  const [isAirdropModalOpen, setIsAirdropModalOpen] = useState(false);


  const createAccountFun = useCallback(async () => {
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

      // if (!account) {
      //   createAccountFun()
      // }

      // 存储 balanceList
      const balanceList = []
      const { tokens } = wallet?.contents || { tokens: {} }
      Object.keys(tokens).forEach(async (v) => {
        const obj = tokens[v]
        const symbol = v.substring(v.lastIndexOf(':') + 1)
        let tokenInfo
        try {
          tokenInfo = await (new JsonRpcProvider(providerValue)).getCoinMetadata(v)
        } catch (e) {
          // console.log('error', e)
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
            formateBalance: new BN(obj.balance.toString(10)).dividedBy(BIG_TEN.pow(symbol === 'SCALE' ? 6 : tokenInfo.decimals)).toString(10),
            coins: obj.coins.sort((a, b) => { return b.balance - a.balance })
          })
        }
        dispatch(setBalanceList(JSON.stringify(balanceList) || '[]')) // 存 balanceList

        balanceList.forEach(v => {
          if (v.symbol === 'SCALE') {
            setScaleBalance(keepDecimal2(v.formateBalance))
          }
        })
      })
    }


    if (account) {
      API.getAccountInfo(account).then(result => {
        // result.data.margin_total = keepDecimal2((new BigNumber(result.data.margin_total).times(formatTenDecimalNum(-6))).toString(10))
        dispatch(setUserInfo(result.data));
      });
    }
  }, [account, dispatch, provider, providerValue, status, wallet])


  const handleOk = async () => {
    if (!account) {
      messageApi.open({
        type: 'warning',
        content: 'you need Sui Token to creat your margin account!',
        style: {
          marginTop: 77
        }
      })
      return
    }
    const formatAmount = (new BigNumber(inputValue).times(BIG_TEN.pow(6))).toString(10)
    const scaleObjectIds = getTokenObjectIds(storeBalanceList || '[]', 'SCALE').slice(0, 1)
    if (modalActive === 'deposit') {
      try {
        const rp = await deposit(wallet, account, formatAmount, scaleObjectIds)

        if (rp.confirmedLocalExecution) {
          messageApi.open({
            type: 'success',
            content: 'Deposit Successful!',
            style: {
              marginTop: 77
            }
          })
        } else {
          messageApi.open({
            type: 'warning',
            content: 'Deposit fail, Please try again later.',
            style: {
              marginTop: 77
            }
          })
        }
      } catch (e) {
        messageApi.open({
          type: 'error',
          content: e.message
        })
      }
    } else if (modalActive === 'withdraw') {
      try {
        const rp = await withdraw(wallet, account, formatAmount)
        if (rp.confirmedLocalExecution === 'success') {
          messageApi.open({
            type: 'success',
            content: 'Withdraw Successful!',
            style: {
              marginTop: 77
            }
          })
        } else {
          messageApi.open({
            type: 'warning',
            content: 'Withdraw fail, Please try again later',
            style: {
              marginTop: 77
            }
          })
        }
      } catch (e) {
        console.log('err', e)
        messageApi.open({
          type: 'error',
          content: e.message,
          style: {
            marginTop: 77
          }
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
    if (type === 'create') {
      createAccountFun()
    } else {
      setIsModalOpen(() => true)
      setModalActive(() => type)
    }
  }, [createAccountFun])

  const handleInput = (e) => {
    let value = e.target.value;
    const pattern = /^[0-9]*$/;
    if (!pattern.test(value)) {
      value = value.replace(/[^0-9]/g, '');
      e.target.value = value;
    }
    setInputValue(e.target.value);
  };
  const handleLogOut = useCallback(async () => {
    if (!wallet) return
    const asd = await wallet.disconnect()
    console.log('asd', asd)
    dispatch(setAccount(''))
    dispatch(setAddress(''))  // 存 address
  }, [dispatch, wallet])

  const content = (
    <div className="header-popover-content">
      <p className="taplight2" onClick={() => handleLogOut()}>Log out</p>
    </div>
  );

  return (
    <>
      {contextHolder}
      <div className="mui-header">
        <div className="section mui-fl-vert mui-fl-btw">
          <div className="mui-fl-vert">
            <p className="logo"></p>
            {address &&
              <div className="account-info mui-fl-vert">
                {account ?
                  <>
                    <p className="title mui-fl-vert taplight2">
                      <span>Account</span>
                      <i className="mico-arrow-right" />
                    </p>
                    <ul className="info mui-fl-vert">
                      <li>
                        <p>Balance</p>
                        <p>$ {userInfo ? userInfo.balance : '--'}</p>
                      </li>
                      <li>
                        <p>Margin</p>
                        <p>$ {userInfo ? userInfo?.margin_total : '--'}</p>
                      </li>
                      <li>
                        <p>Margin Level</p>
                        <p>{userInfo && userInfo?.margin_percentage ? formatNum((userInfo?.margin_percentage || 0)) + '%' : '--'}</p>
                      </li>
                      <li className="condition mui-fl-vert">
                        <i className="mico-success"></i>
                        <span>Good Condition</span>
                      </li>
                    </ul>
                    <div className="btns mui-fl-vert">
                      <p className="taplight2" onClick={() => openModal('deposit')}>Deposit</p><p></p><p className="taplight2" onClick={() => openModal('withdraw')}>Withdraw</p>
                    </div>
                  </>
                  :
                  <div className="mui-fl-vert header-no-account">
                    <p>Create account with {formatAddress(address)} to start trading</p>
                    <p className="taplight2" onClick={() => openModal('create')}>Create Now</p>
                  </div>
                }
              </div>
            }
          </div>

          <div className="mui-fl-vert">
            {/* <div className="global mui-fl-vert">
            <i className="mico-global"></i>
            <p className="mui-fl-vert taplight2">
              <span>US</span>
              <i className="mico-arrow-right" />
            </p>
          </div> */}
            <div>
              {!wallet ? (
                <SignInButton>
                  <span className="connect-btn mui-fl-vert">
                    Connect
                    <i className="mico-arrow-right-white" />
                  </span>
                </SignInButton>
              ) : (
                <Popover placement="bottom" content={content} trigger="click">
                  <div className="connect-btn address-btn mui-fl-vert taplight">
                    <span>{formatAddress(accountModule.address)}</span>
                    <i className="mico-arrow-right" />
                  </div>
                </Popover>
              )}
            </div>
          </div>
        </div>

        <Modal className="sty1-modal header-modal" centered width={386} okText='Confirm' title={modalActive === 'deposit' ? 'Deposit Margin' : 'Withdraw Margin'} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <p className="p1">
            {modalActive === 'deposit' ? 'From Wallet: ' : 'To Wallet: '}
            <span>{formatAddress(address)}</span>
          </p>
          <Input value={inputValue} onInput={handleInput} />
          <div className="header-modal-balance">
            {modalActive === 'deposit' ? `Your wallet: $${scaleBalance}` : `Your balance: $${userInfo?.balance}`}
          </div>
        </Modal>

        <Modal open={isAirdropModalOpen} title="Warning" className="sty2-modal" onOk={() => setIsAirdropModalOpen(false)} onCancel={() => setIsAirdropModalOpen(false)}>
          You need testUSD，please claim at <a href="/airdrop">{window.location.origin + '/airdrop'}</a>
        </Modal>
      </div>
    </>
  );
}

export default Header;
