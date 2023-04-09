// export const NETWORK = 'https://explorer-rpc.devnet.sui.io'
export const NETWORK = 'https://wallet-rpc.devnet.sui.io'
// export const NETWORK = 'https://fullnode.devnet.sui.io'


// 带有_COIN的是关于代币 Scale 币的参数，不带的是关于合约的参数

// Scale coin
export const CONIN_PACKAGE_OBJECTID = '0xdea89441b410132ddda2b94de509027accce06bffcd5f03888cac8569e40bf0b'
export const CONIN_MODULE = 'scale'
export const CONIN_ADMIN_CAP = '0x3d011dba7bee44532dd15ce93cd23bfe7e21723020414e65c904cf85b4123a6b'
export const CONIN_RESERVE = '0xdb4253053667d963ac4f58b67e9f0cbb65d1572c4eb05fc3b0d02e0c65f3dbed'

// Scale 主合约
export const PACKAGE_OBJECTID = '0x3d6c288df4121b6692887d21179fc800f58f67a910b55d558dda16d81cb4b016'
export const MODULE = 'enter'
export const ADMIN_CAP = '0x128263eb58e7e86ccc23cc354cad0b7424260d1d70b4e56c570bfb305d992b99'
export const SCALE_NFT_FACTORY = '0x092f61eab2a29d0342d44bd26ef6e1a73d6fff6dfa8e36a27829ca85968be4d7'
export const MARKET_LIST = '0x61364206135302d7f620d29c9856440bf7575e78d938f9fffbb5e17877e8b2ee'

export const MARKET = '0x8e3f4ca1762a5bacff2513dd81883e53629f8ef2e7ca1e01bf5ed602781ed512'  // 需要从 market 列表里面拿，不能写死哦~
export const TYPE = {
  P: '0x3d6c288df4121b6692887d21179fc800f58f67a910b55d558dda16d81cb4b016::pool::Scale',
  T: '0xdea89441b410132ddda2b94de509027accce06bffcd5f03888cac8569e40bf0b::scale::SCALE'
}


// scale oracle 临时报价服务
export const ORACLE_PACKAGE_OBJECTID = '0xe8078b1881197e368a5818a99d4ad7cfe638e8cff4c5356668d2d434c9d1c359'
export const ORACLE_MODULE = 'oracle'

export const ORACLE_ADMIN_CAP = '0xf7a476ad8b01847e33b78127be1e766264243d9ad55ec8ebf926f68fc33d8763'
export const ORACLE_ROOT = '0xec84ca730bad1303d998d3f47aa23bb3f8190ce6d62292088e0ac4a89aaa1046'