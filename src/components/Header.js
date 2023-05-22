import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import BigNumber from 'bignumber.js'
import { Modal, Input, message, Popover } from 'antd';
import { JsonRpcProvider, Connection } from '@mysten/sui.js'

import API from "../api/api";
import { setAccount, setAddress, setWallet, setBalanceList, setProvider, setUserInfo } from './../store/action'
import { formatAddress, getTokenObjectIds, keepDecimal2, formatNum } from './../utils/filter'
import { PACKAGE_OBJECTID, CONIN_PACKAGE_OBJECTID } from './../utils/token'
import { deposit, withdraw, createAccount } from './../utils/sui'
import './../assets/css/components/header.css'

import { ConnectButton, useAccountBalance, useWallet, SuiMainnetChain } from "@suiet/wallet-kit";
import '@suiet/wallet-kit/style.css';


const BN = BigNumber.clone({ ROUNDING_MODE: 1, DECIMAL_PLACES: 9 })
const BIG_TEN = new BigNumber(10)
function Header() {
  const wallet01 = useWallet()
  const { balance } = useAccountBalance()

  const [messageApi, contextHolder] = message.useMessage()
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

    const rp = await createAccount(wallet01, scaleObjectIds[0])
    if (rp.confirmedLocalExecution) {
      messageApi.open({
        type: 'success',
        content: 'Create Account Successful!',
        style: {
          marginTop: 77
        }
      })
      // console.log('wallet', wallet)
      // setTimeout(() => {
      //   const { objects } = wallet?.contents || { objects: [] }
      //   objects.forEach((v) => {
      //     if (v.type === `${PACKAGE_OBJECTID}::account::UserAccount`) {
      //       dispatch(setAccount(v.extraFields.account_id || ''))  // 存 account
      //     }
      //   })
      //   // console.log('wallet', wallet)
      // }, 2000)
      getAccount01()
    } else {
      messageApi.open({
        type: 'warning',
        content: 'Create Account fail, Please try again later',
        style: {
          marginTop: 77
        }
      })
    }
  }, [messageApi, storeBalanceList])

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
      // console.log('wallet01', wallet01)
      // console.log('SuiMainnetChain', SuiMainnetChain)
      // if (wallet01.chain.id === )
      dispatch(setWallet(JSON.parse(JSON.stringify(wallet01) || null)))  // 存 wallet
      dispatch(setAddress(wallet01?.address || ''))  // 存 address
      dispatch(setProvider(wallet01.chain.rpcUrl))
      // console.log('wallet01.chain.rpcUrl', wallet01.chain)
      // console.log()
      getBalanceList01()
      getAccount01()
    }

    // if (wallet && status === 'connected') {
      // dispatch(setAddress(wallet?.address || ''))  // 存 address
      // dispatch(setWallet(JSON.parse(JSON.stringify(wallet) || null)))  // 存 wallet

      // dispatch(setProvider(provider.connection.fullnode || ''))

      // const { objects } = wallet?.contents || { objects: [] }
      // objects.forEach((v) => {
      //   if (v.type === `${PACKAGE_OBJECTID}::account::UserAccount`) {
      //     dispatch(setAccount(v.extraFields.account_id || ''))  // 存 account
      //   }
      // })

      // if (!account) {
      //   createAccountFun()
      // }

      // 存储 balanceList
      // const balanceList = []
      // const { tokens } = wallet?.contents || { tokens: {} }
      // Object.keys(tokens).forEach(async (v) => {
      //   const obj = tokens[v]
      //   const symbol = v.substring(v.lastIndexOf(':') + 1)
      //   let tokenInfo
      //   try {
      //     tokenInfo = await (new JsonRpcProvider(providerValue)).getCoinMetadata(v)
      //   } catch (e) {
      //     // console.log('error', e)
      //     tokenInfo = { decimals: 0, symbol }
      //   }
      //   if (symbol === 'SUI') {
      //     balanceList.unshift({
      //       symbol,
      //       balance: obj.balance.toString(10),
      //       formateBalance: new BN(obj.balance.toString(10)).dividedBy(BIG_TEN.pow(tokenInfo.decimals)).toString(10),
      //       coins: obj.coins.sort((a, b) => { return b.balance - a.balance })
      //     })
      //   } else {
      //     balanceList.push({
      //       symbol,
      //       balance: obj.balance.toString(10),
      //       formateBalance: new BN(obj.balance.toString(10)).dividedBy(BIG_TEN.pow(symbol === 'SCALE' ? 6 : tokenInfo.decimals)).toString(10),
      //       coins: obj.coins.sort((a, b) => { return b.balance - a.balance })
      //     })
      //   }
      //   dispatch(setBalanceList(JSON.stringify(balanceList) || '[]')) // 存 balanceList

      //   balanceList.forEach(v => {
      //     if (v.symbol === 'SCALE') {
      //       setScaleBalance(keepDecimal2(v.formateBalance))
      //     }
      //   })
      // })
    // }


    if (account) {
      API.getAccountInfo(account).then(result => {
        dispatch(setUserInfo(result.data));
      });
    }
  }, [wallet01])

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

  const getAccount01 = async () => {
    const fullnodeProvider = new JsonRpcProvider(new Connection({
      fullnode: wallet01.chain.rpcUrl
    }))
    // 获取account
    const { data: objectLists } = await fullnodeProvider.getOwnedObjects({
      owner: wallet01.address,
      options: { showType: true, showDisplay: true, showContent: true }
    })
    objectLists.forEach(v => {
      if (v.data.type === `${PACKAGE_OBJECTID}::account::UserAccount`) {
        dispatch(setAccount(v.data.objectId || ''))  // 存 account
      }
    })
  }


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
        const rp = await deposit(wallet01, account, formatAmount, scaleObjectIds)

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
        const rp = await withdraw(wallet01, account, formatAmount)
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
    if (!wallet01) return
    const asd = await wallet01.disconnect()
    console.log('asd', asd)
    dispatch(setAccount(''))
    dispatch(setAddress(''))  // 存 address
  }, [dispatch, wallet01])

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
              {address === '' ? (
                <ConnectButton className="connect-btn ">
                  <span className='mui-fl-vert'>
                    Connect
                    <i className="mico-arrow-right-white" />
                  </span>
                </ConnectButton>
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
