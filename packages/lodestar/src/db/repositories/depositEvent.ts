import {IChainForkConfig} from "@chainsafe/lodestar-config";
import {phase0, ssz} from "@chainsafe/lodestar-types";
import {Db, Bucket, Repository} from "@chainsafe/lodestar-db";

/**
 * DepositData indexed by deposit index
 * Removed when included on chain or old
 */
export class DepositEventRepository extends Repository<number, phase0.DepositEvent> {
  constructor(config: IChainForkConfig, db: Db) {
    super(config, db, Bucket.phase0_depositEvent, ssz.phase0.DepositEvent);
  }

  async deleteOld(depositCount: number): Promise<void> {
    const firstDepositIndex = await this.firstKey();
    if (firstDepositIndex === null) {
      return;
    }
    await this.batchDelete(Array.from({length: depositCount - firstDepositIndex}, (_, i) => i + firstDepositIndex));
  }

  async batchPutValues(depositEvents: phase0.DepositEvent[]): Promise<void> {
    await this.batchPut(
      depositEvents.map((depositEvent) => ({
        key: depositEvent.index,
        value: depositEvent,
      }))
    );
  }
}
