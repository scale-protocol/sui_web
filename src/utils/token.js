// export const NETWORK = 'https://explorer-rpc.devnet.sui.io'
export const NETWORK = 'https://wallet-rpc.mainnet.sui.io/'
// export const NETWORK = 'https://fullnode.devnet.sui.io'

// export const NETWORK = 'https://wallet-rpc.testnet.sui.io'



// 带有_COIN的是关于代币 Scale 币的参数，不带的是关于合约的参数

// Scale coin
export const CONIN_PACKAGE_OBJECTID = '0xf2e07f814fcd4e37cc1acd7d7b335814cf6fbe4fe7f9d5483c814082c16556af'
export const CONIN_MODULE = 'scale'
export const CONIN_ADMIN_CAP = '0xc0ef05c5e06fe088032d9cbaea1e19b16b848ff488243f8cc31a5beb4fd63200'
export const CONIN_RESERVE = '0xfdb87fbc5299b768e29770e117af06646f72abf2a0fe40937d03238a8f08038f'

// Scale 主合约
// export const PACKAGE_OBJECTID = '0x001f72073dcdc4425ba0e2b94ba0f02545b66da058b293cae695ee36e5d4a1ae'
export const PACKAGE_OBJECTID = '0x1f72073dcdc4425ba0e2b94ba0f02545b66da058b293cae695ee36e5d4a1ae'
export const MODULE = 'enter'
export const ADMIN_CAP = '0xa58b8e509daeb428e67ff164c6bcebbef9dd0869591825e0276867551cd301f1'
export const SCALE_NFT_FACTORY = '0x4660f1075e64aa08fa6665e4ace9022bf6d61c0f5c18c2f48258f93c5be4f658'
export const MARKET_LIST = '0xb7f0575d1124b05a7e94d986f52142c6cba676d2582378fd59aac572e22a034e'

export const MARKET = '0x06f1a7b6abfddea3fd67d47346998282dc3202322b2350b188a680d519ba3018'  // 需要从 market 列表里面拿，不能写死哦~
export const TYPE = {
  P: '0x1f72073dcdc4425ba0e2b94ba0f02545b66da058b293cae695ee36e5d4a1ae::pool::Scale',
  T: '0xf2e07f814fcd4e37cc1acd7d7b335814cf6fbe4fe7f9d5483c814082c16556af::scale::SCALE'
}


// scale oracle 临时报价服务
export const ORACLE_PACKAGE_OBJECTID = '0x63f930881f4207460a67846db62bc89a82d87570a3dc2bedb546b30bd4c6ff19'
export const ORACLE_MODULE = 'oracle'

export const ORACLE_ADMIN_CAP = '0x61efa26addca90039afae3186e812b5c65b79a7e12a283519f655348983cfade'
export const ORACLE_ROOT = '0xd7ac4f380021b080f9506f42b99b21a3c65d7b685a50d4b7e5a6a22ce976a89b'

// NFT 合约
export const NFT_PACKAGE = '0x38e736a4fbd7fbaecc3d34e75567cc09e5e34656ccff652210d964d46f9616b3'
export const NFT_ADMIN_CAP = '0x7db8aafcf0af144bbade3b2bafff8adcad0d28aa548f59b54891e6da8a15a214'