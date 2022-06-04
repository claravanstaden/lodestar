import {bellatrix, Slot, Root, BLSPubkey} from "@chainsafe/lodestar-types";
import {IChainForkConfig} from "@chainsafe/lodestar-config";
import {getClient, Api as BuilderApi} from "@chainsafe/lodestar-api/builder";

import {IExecutionBuilder} from "./interface.js";

export type ExecutionBuilderHttpOpts = {
  enabled: boolean;
  urls: string[];
  timeout?: number;
};

export const defaultExecutionBuilderHttpOpts: ExecutionBuilderHttpOpts = {
  enabled: false,
  urls: ["http://localhost:8661"],
  timeout: 12000,
};

export class ExecutionBuilderHttp implements IExecutionBuilder {
  readonly api: BuilderApi;

  constructor(opts: ExecutionBuilderHttpOpts, config: IChainForkConfig) {
    const baseUrl = opts.urls[0];
    if (!baseUrl) throw Error("No Url provided for executionBuilder");
    this.api = getClient({baseUrl, timeoutMs: opts.timeout}, {config});
  }

  async registerValidator(registrations: bellatrix.SignedValidatorRegistrationV1[]): Promise<void> {
    return this.api.registerValidator(registrations);
  }

  async getPayloadHeader(
    slot: Slot,
    parentHash: Root,
    proposerPubKey: BLSPubkey
  ): Promise<bellatrix.ExecutionPayloadHeader> {
    const {data: signedBid} = await this.api.getPayloadHeader(slot, parentHash, proposerPubKey);
    const executionPayloadHeader = signedBid.message.header;
    return executionPayloadHeader;
  }

  async submitSignedBlindedBlock(
    signedBlock: bellatrix.SignedBlindedBeaconBlock
  ): Promise<bellatrix.SignedBeaconBlock> {
    const {data: executionPayload} = await this.api.submitSignedBlindedBlock(signedBlock);
    const fullySignedBlock: bellatrix.SignedBeaconBlock = {
      ...signedBlock,
      message: {...signedBlock.message, body: {...signedBlock.message.body, executionPayload}},
    };
    return fullySignedBlock;
  }
}
