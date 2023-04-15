// export const NETWORK = 'https://explorer-rpc.devnet.sui.io'
export const NETWORK = 'https://wallet-rpc.devnet.sui.io'
// export const NETWORK = 'https://fullnode.devnet.sui.io'

// export const NETWORK = 'https://wallet-rpc.testnet.sui.io'



// 带有_COIN的是关于代币 Scale 币的参数，不带的是关于合约的参数

// Scale coin
export const CONIN_PACKAGE_OBJECTID = '0x263bd86d77ea176ae720912c23f3ad42b80eeccaa738fb53f56e92bca268ff0b'
export const CONIN_MODULE = 'scale'
export const CONIN_ADMIN_CAP = '0x5dfe65177dae451ab3a2c9fb48678b4a1c593cdeddda52a4e0af73a0310cc894'
export const CONIN_RESERVE = '0x15e6a83b99deb229e2f2c03f0dda8a602a073595862d1d56c7324b20d5d13618'

// Scale 主合约
export const PACKAGE_OBJECTID = '0x5f3c102fe2b3a56809a98cfde024f57707d2cf30548f26bbf4129468edac3fb2'
export const MODULE = 'enter'
export const ADMIN_CAP = '0x93d4364e059a1d588fa760287b35dbc630868c0020ac3e8b0b91ddff977f0756'
export const SCALE_NFT_FACTORY = '0x0435dd1806c37e5041c0fc13ac695ea6899dfaef7a2cf75bfd77821dd5224dcd'
export const MARKET_LIST = '0xa340e3a98ff53a97d3df1e51ebff6fc35e41b2e4c095715812f7979a76cd4709'

export const MARKET = '0x06f1a7b6abfddea3fd67d47346998282dc3202322b2350b188a680d519ba3018'  // 需要从 market 列表里面拿，不能写死哦~
export const TYPE = {
  P: '0x5f3c102fe2b3a56809a98cfde024f57707d2cf30548f26bbf4129468edac3fb2::pool::Scale',
  T: '0x263bd86d77ea176ae720912c23f3ad42b80eeccaa738fb53f56e92bca268ff0b::scale::SCALE'
}


// scale oracle 临时报价服务
export const ORACLE_PACKAGE_OBJECTID = '0x5f47b0645a5c4df8e2fec5950914b3833bed969d987bb579a3ecc579c142c319'
export const ORACLE_MODULE = 'oracle'

export const ORACLE_ADMIN_CAP = '0xbb94fa5670e3f6b9fd8c5add9b06c003cf60c33fc09631feae79fdf156c9d230'
export const ORACLE_ROOT = '0x2ca936aad2ec60a563ca5660ea3b7d54e1bf6c9c6a0a2797d8d55e3c84e43401'

// NFT 合约
export const NFT_PACKAGE = '0x38e736a4fbd7fbaecc3d34e75567cc09e5e34656ccff652210d964d46f9616b3'
export const NFT_ADMIN_CAP = '0x7db8aafcf0af144bbade3b2bafff8adcad0d28aa548f59b54891e6da8a15a214'