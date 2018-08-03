import { Callback } from '@app/interfaces'
import { TrieDB, TrieDBOptions } from '@app/vm/trie/db/triedb-interface'
import * as rpc from '@enkrypt.io/json-rpc2'
import * as Redis from 'ioredis'

export interface RedisTrieDbOpts {
  host: string,
  port: number,
  rpcHost: string
  rpcPort: number
}

export class RedisTrieDb implements TrieDB {
  private readonly redis: Redis.Redis
  private readonly rpc: any

  constructor(private readonly opts: RedisTrieDbOpts) {
    this.redis = new Redis({
      host: this.opts.host,
      port: this.opts.port
    })
    this.rpc = rpc.Client.$create(this.opts.rpcPort, this.opts.rpcHost)
  }

  public get(key: Buffer, opts: TrieDBOptions, cb: Callback) {
    this.redis.get(key.toString(), (err: Error, result: string) => {
      if (!err && result) {
        cb(null, new Buffer(result, 'hex'))
        return
      }

      // Otherwise retrieve from RPC
      this.rpc.call('eth_getKeyValue', ['0x' + key.toString('hex')], (e: Error, res: string) => {
        if (e) {
          cb(err, null)
          return
        }

        const buffer: Buffer = new Buffer(res.substring(2), 'hex')
        this.redis.set(key.toString(), buffer.toString('hex'))

        cb(null, buffer)
      })
    })
  }

  public put(key: Buffer, val: Buffer, opts: TrieDBOptions, cb: Callback) {
    this.redis.set(key.toString(), val, (err: Error, result: string) => {
      if (!err && result) {
        cb(null, new Buffer(result, 'hex'))
        return
      }

      cb(err, null)
    })
  }

  public del(key: Buffer, cb: Callback) {
    throw new Error('Method not implemented.')
  }

  public batch(ops: any[], opts: TrieDBOptions, cb: Callback) {
    throw new Error('Method not implemented.')
  }
}
