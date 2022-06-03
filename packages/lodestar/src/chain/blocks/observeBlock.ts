import {Epoch, ValidatorIndex} from "@chainsafe/lodestar-types";
import {SeenAttesters} from "../seenCache/seenAttesters.js";
// TODO abstract out the Seen* caches into an abstract abstract data structure
// that all the caches can extend since they share similar structure.

export class ObservedProposers extends SeenAttesters {}
export class ObservedAttesters extends SeenAttesters {
  addIndices(targetEpoch: Epoch, validatorIndex: ValidatorIndex[]): void {
    if (targetEpoch < this.lowestPermissibleEpoch) {
      throw Error(`EpochTooLow ${targetEpoch} < ${this.lowestPermissibleEpoch}`);
    }

    this.prune(targetEpoch);

    for (const index of validatorIndex) {
      this.validatorIndexesByEpoch.getOrDefault(targetEpoch).add(index);
    }
  }
}
