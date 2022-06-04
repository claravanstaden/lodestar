import {bellatrix, Root, Slot, BLSPubkey} from "@chainsafe/lodestar-types";

export interface IExecutionBuilder {
  registerValidator(registrations: bellatrix.SignedValidatorRegistrationV1[]): Promise<void>;
  getPayloadHeader(slot: Slot, parentHash: Root, proposerPubKey: BLSPubkey): Promise<bellatrix.ExecutionPayloadHeader>;
  submitSignedBlindedBlock(signedBlock: bellatrix.SignedBlindedBeaconBlock): Promise<bellatrix.SignedBeaconBlock>;
}
