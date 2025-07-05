import assert from 'assert'
import Coin from './Coin'

export class TransactionRequest {

  id: number = 0

  srcCoin: Coin = 'ZEN'

  dstCoin: Coin = 'BTC'

  amount: number = 10

  dstAddress: string = ''

  dstAddressValid: boolean = false

  amountValid: boolean = false

}

export default TransactionRequest
