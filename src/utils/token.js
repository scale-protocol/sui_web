// export const NETWORK = 'https://explorer-rpc.devnet.sui.io'
// export const NETWORK = 'https://wallet-rpc.devnet.sui.io'
// export const NETWORK = 'https://fullnode.devnet.sui.io'

export const NETWORK = 'https://wallet-rpc.testnet.sui.io'



// 带有_COIN的是关于代币 Scale 币的参数，不带的是关于合约的参数

// Scale coin
export const CONIN_PACKAGE_OBJECTID = '0x2312955c35acc8a73aef16cdf541b33fa027fe3cfba6a01d297c572449e9cdb5'
export const CONIN_MODULE = 'scale'
export const CONIN_ADMIN_CAP = '0x05942e157e0f715d405afcfee5c0f9cf9b090cd606107baa310d0615f968ff31'
export const CONIN_RESERVE = '0x8f7f2a6fb357b7b07fe43e3242e28611f4240f24a85b7fba3464ff2efc037d38'

// Scale 主合约
export const PACKAGE_OBJECTID = '0xa186facfc7cdb2a90048518789c3fb59ca799923ccbf94bc6fbae01a919a0194'
export const MODULE = 'enter'
export const ADMIN_CAP = '0x2b22cbd8b65aa6a7f33f4dfb2bb0b98b9e327f8a2b8e4cee354d88341bdd457b'
export const SCALE_NFT_FACTORY = '0x6fe4bbc4dc008f07cacabbbe51c4a468ef59ad2a27b90ad9a56ec52bf98f3c3c'
export const MARKET_LIST = '0xd273856fb0253c2000c119c6ea8db7605005184e59514262f2e3cd2cb7e2bb62'

export const MARKET = '0x06f1a7b6abfddea3fd67d47346998282dc3202322b2350b188a680d519ba3018'  // 需要从 market 列表里面拿，不能写死哦~
export const TYPE = {
  P: '0xa186facfc7cdb2a90048518789c3fb59ca799923ccbf94bc6fbae01a919a0194::pool::Scale',
  T: '0x2312955c35acc8a73aef16cdf541b33fa027fe3cfba6a01d297c572449e9cdb5::scale::SCALE'
}


// scale oracle 临时报价服务
export const ORACLE_PACKAGE_OBJECTID = '0x95411f388239f12c4b26ab3ba2d8a2656c1e79d97e68b68103de3e0c85404d8b'
export const ORACLE_MODULE = 'oracle'

export const ORACLE_ADMIN_CAP = '0x6420bfd7bc8bc47ee5bae9cc4d87363aa5e77fb61a89f30efeae77029dcc7520'
export const ORACLE_ROOT = '0x4b4ce2e51e98346d8f2484acaccefb2492d682c484c7a40397accdd88cf8ce6d'

// NFT 合约
export const NFT_PACKAGE = '0x851350adc7584705d43a2e5e902dd299e514da1f1074cc02553a462da4a0c567'
export const NFT_ADMIN_CAP = '0x94a81bdf7a76d7c8a178447bcdc8ef99792ecabf085f176131700512fda6f8a9'