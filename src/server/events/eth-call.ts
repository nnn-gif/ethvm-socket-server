import { logger, validators } from '@app/helpers'
import { Callback } from '@app/interfaces'
import { EthVMServer, SocketEvent } from '@app/server'

const ethCallEvent: SocketEvent = {
  name: 'ethCall',
  onEvent: (server: EthVMServer, socket: SocketIO.Socket, payload: any, cb: Callback): void => {
    const isValid =  _.isObject(payload) && validators.ethCallPayloadValidator(payload)
    if (!isValid) {
      logger.error(`event -> ethCall / Invalid payload: ${payload}`)
      cb(validators.ethCallPayloadValidator.errors, null)
      return
    }

    // TODO: Restore proper behavior
    // server.vmRunner.call(payload.to, payload.data, cb)
  }
}

export default ethCallEvent
