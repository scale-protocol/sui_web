export type tokenInfo = {
    symbol: string,
    balance: string,
    formateBalance: string,
    coins: Array<coinInfo>
}

export type coinInfo = {
    balance: string,
    objectId: string,
    type: string
}

export type objectInfo = {
    description: string,
    details: any,
    extraFields: object,
    name: string,
    objectId: string,
    status: string,
    type: string
}