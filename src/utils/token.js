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
export const PACKAGE_OBJECTID = '0xbf7c8581f2b1ee4132062b431537227477986cd846210d7a689f0207a9742604'
export const MODULE = 'enter'
export const ADMIN_CAP = '0x5d2ddbca324a51fd98a3d742abb3d3d71f3bd1f83b887d1f117b2d92a51fa075'
export const SCALE_NFT_FACTORY = '0x09aca5df2057bd312167821b208981e8b1f8eb6bec4162a73edc3f0350a7cf66'
export const MARKET_LIST = '0x40da0289a3bf57f75824b8a419a72bb8aceeccdd1d545ca2f435d40b2733c2d7'

export const MARKET = '0xfd8a967be00215082a4500701aff7628eda05409c3f8ad32db619ffd2f96ffee'  // 需要从 market 列表里面拿，不能写死哦~
export const TYPE = {
  P: '0xbf7c8581f2b1ee4132062b431537227477986cd846210d7a689f0207a9742604::pool::Scale',
  T: '0xdea89441b410132ddda2b94de509027accce06bffcd5f03888cac8569e40bf0b::scale::SCALE'
}


// scale oracle 临时报价服务
export const ORACLE_PACKAGE_OBJECTID = '0xe8078b1881197e368a5818a99d4ad7cfe638e8cff4c5356668d2d434c9d1c359'
export const ORACLE_MODULE = 'oracle'

export const ORACLE_ADMIN_CAP = '0xf7a476ad8b01847e33b78127be1e766264243d9ad55ec8ebf926f68fc33d8763'
export const ORACLE_ROOT = '0xec84ca730bad1303d998d3f47aa23bb3f8190ce6d62292088e0ac4a89aaa1046'