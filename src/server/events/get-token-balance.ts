import { errors, logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const getTokenBalanceEvent: SocketEvent = {
  name: 'getTokenBalance', // new_name: tokens_balance
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid = validators.tokensBalancePayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> getTokenBalance / Invalid payload: ${payload}`)
      cb(validators.tokensBalancePayloadValidator.errors, null)
      return
    }

    server.vmEngine
      .getTokensBalance(payload.address)
      .then((result: any): void => cb(null, result))
      .catch(
        (error: Error): void => {
          logger.error(`event -> getTokenBalance / Error: ${error}`)
          cb(errors.serverError, null)
        }
      )
  }
}

export default getTokenBalanceEvent
