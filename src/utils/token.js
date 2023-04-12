// export const NETWORK = 'https://explorer-rpc.devnet.sui.io'
export const NETWORK = 'https://wallet-rpc.devnet.sui.io'
// export const NETWORK = 'https://fullnode.devnet.sui.io'


// 带有_COIN的是关于代币 Scale 币的参数，不带的是关于合约的参数

// Scale coin
export const CONIN_PACKAGE_OBJECTID = '0xc8d5e09170d990d9c0fa4885be0f1fc891b3ad0b886945b46d783cf476425c81'
export const CONIN_MODULE = 'scale'
export const CONIN_ADMIN_CAP = '0xa6493a5876706e9d3f740757b55479855e6cee3430bb680e16556b650d0f58b0'
export const CONIN_RESERVE = '0xb41599b87525acc85a22dcead87610415c9db26600f558c25444c2be356b98d7'

// Scale 主合约
export const PACKAGE_OBJECTID = '0xe206ea2b6a8cd8dd024b9cf7785884eb69cffbca7da4aef82eff21820ef3e5b1'
export const MODULE = 'enter'
export const ADMIN_CAP = '0xae1e770da2b424480237c9115131ec06787cfb51b2a7cefe777195af7ad78ceb'
export const SCALE_NFT_FACTORY = '0x10f58de736d53155a5f39261583faf48343a29adbde9fa8ce59d4ba84688de03'
export const MARKET_LIST = '0xe85576bfef3c9238a12c669392c5a186061bfb9d33254d4a2b6ea0ec2353ab67'

export const MARKET = '0x06f1a7b6abfddea3fd67d47346998282dc3202322b2350b188a680d519ba3018'  // 需要从 market 列表里面拿，不能写死哦~
export const TYPE = {
  P: '0xe206ea2b6a8cd8dd024b9cf7785884eb69cffbca7da4aef82eff21820ef3e5b1::pool::Scale',
  T: '0xc8d5e09170d990d9c0fa4885be0f1fc891b3ad0b886945b46d783cf476425c81::scale::SCALE'
}


// scale oracle 临时报价服务
export const ORACLE_PACKAGE_OBJECTID = '0xc7e8da605ccdf533b26cd7aa92fc52a7aadb1a8b950f86214699004fea98a022'
export const ORACLE_MODULE = 'oracle'

export const ORACLE_ADMIN_CAP = '0x15bdc180dd325c27a931aa651e06aba2b54fabc523f3eaf09c027c6325bbcf54'
export const ORACLE_ROOT = '0xaa74dc51f8bee73e6f414935800655cdfa24d9051d0b6df849085e9f35990600'

// NFT 合约
export const NFT_PACKAGE = '0x851350adc7584705d43a2e5e902dd299e514da1f1074cc02553a462da4a0c567'
export const NFT_ADMIN_CAP = '0x94a81bdf7a76d7c8a178447bcdc8ef99792ecabf085f176131700512fda6f8a9'