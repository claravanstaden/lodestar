import {ForkSeq} from "@chainsafe/lodestar-params";
import {allForks, altair, bellatrix} from "@chainsafe/lodestar-types";
import {ExecutionEngine} from "../util/executionEngine.js";
import {isExecutionEnabled} from "../util/bellatrix.js";
import {CachedBeaconStateAllForks, CachedBeaconStateBellatrix} from "../types.js";
import {processExecutionPayload} from "./processExecutionPayload.js";
import {processSyncAggregate} from "./processSyncCommittee.js";
import {processBlockHeader} from "./processBlockHeader.js";
import {processEth1Data} from "./processEth1Data.js";
import {processOperations} from "./processOperations.js";
import {processRandao} from "./processRandao.js";

// Spec tests
export {processBlockHeader, processExecutionPayload, processRandao, processEth1Data, processSyncAggregate};
export * from "./processOperations.js";

export * from "./initiateValidatorExit.js";
export * from "./isValidIndexedAttestation.js";

export function processBlock<T extends allForks.BlockType>(
  type: T,
  fork: ForkSeq,
  state: CachedBeaconStateAllForks,
  block: allForks.FullOrBlindedBeaconBlock<T>,
  verifySignatures = true,
  executionEngine: ExecutionEngine | null
): void {
  processBlockHeader(type, state, block);

  // The call to the process_execution_payload must happen before the call to the process_randao as the former depends
  // on the randao_mix computed with the reveal of the previous block.
  if (fork >= ForkSeq.bellatrix) {
    const fullOrBlindedPayload = (type === allForks.BlockType.Blinded
      ? (block as bellatrix.BlindedBeaconBlock).body.executionPayloadHeader
      : (block as bellatrix.BeaconBlock).body.executionPayload) as allForks.FullOrBlindedExecutionPayload<T>;

    const fullOrBlindedBody = (type === allForks.BlockType.Blinded
      ? (block as bellatrix.BlindedBeaconBlock).body
      : (block as bellatrix.BeaconBlock).body) as allForks.FullOrBlindedBellatrixBeaconBlockBody<T>;

    if (isExecutionEnabled(type, state as CachedBeaconStateBellatrix, fullOrBlindedBody)) {
      processExecutionPayload(type, state as CachedBeaconStateBellatrix, fullOrBlindedPayload, executionEngine);
    }
  }

  processRandao(state, block, verifySignatures);
  processEth1Data(state, block.body.eth1Data);
  processOperations(fork, state, block.body, verifySignatures);
  if (fork >= ForkSeq.altair) {
    processSyncAggregate(state, block as altair.BeaconBlock, verifySignatures);
  }
}
