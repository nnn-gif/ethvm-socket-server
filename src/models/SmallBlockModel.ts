import { common } from '@/libs'
import { BlockModel } from '@/models'
import bn from 'bignumber.js'

export class SmallBlockModel {
  constructor(private readonly block: BlockModel) {}

  public hash(): string {
    return '0x' + new Buffer(this.block.hash).toString('hex')
  }

  public smallify(): BlockModel {
    return {
      number: this.block.number,
      intNumber: this.block.intNumber,
      hash: this.block.hash,
      miner: this.block.miner,
      timestamp: this.block.timestamp,
      transactionCount: this.block.transactionHashes.length,
      uncleHashes: this.block.uncleHashes,
      isUncle: this.block.isUncle,
      totalBlockReward: Buffer.from(
        new bn(common.bufferToHex(this.block.blockReward))
          .plus(new bn(common.bufferToHex(this.block.txFees)))
          .plus(new bn(common.bufferToHex(this.block.uncleReward)))
          .toString(16),
        'hex'
      ),
      blockReward: this.block.blockReward,
      txFees: this.block.txFees,
      stateRoot: this.block.stateRoot,
      uncleReward: this.block.uncleReward,
      difficulty: this.block.difficulty,
      blockStats: this.block.blockStats
    }
  }
}
