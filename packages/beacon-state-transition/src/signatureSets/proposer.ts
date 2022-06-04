import {DOMAIN_BEACON_PROPOSER} from "@chainsafe/lodestar-params";
import {allForks, ssz} from "@chainsafe/lodestar-types";
import {computeSigningRoot} from "../util/index.js";
import {ISignatureSet, SignatureSetType, verifySignatureSet} from "../util/signatureSets.js";
import {CachedBeaconStateAllForks} from "../types.js";

export function verifyProposerSignature<T extends allForks.BlockType>(
  type: T,
  state: CachedBeaconStateAllForks,
  signedBlock: allForks.FullOrBlindedSignedBeaconBlock<T>
): boolean {
  const signatureSet = getProposerSignatureSet(type, state, signedBlock);
  return verifySignatureSet(signatureSet);
}

export function getProposerSignatureSet<T extends allForks.BlockType>(
  type: T,
  state: CachedBeaconStateAllForks,
  signedBlock: allForks.FullOrBlindedSignedBeaconBlock<T>
): ISignatureSet {
  const {config, epochCtx} = state;
  const domain = state.config.getDomain(DOMAIN_BEACON_PROPOSER, signedBlock.message.slot);
  const blockType =
    type === allForks.BlockType.Blinded
      ? ssz.bellatrix.BlindedBeaconBlock
      : config.getForkTypes(signedBlock.message.slot).BeaconBlock;

  return {
    type: SignatureSetType.single,
    pubkey: epochCtx.index2pubkey[signedBlock.message.proposerIndex],
    signingRoot: computeSigningRoot(blockType, signedBlock.message, domain),
    signature: signedBlock.signature,
  };
}
