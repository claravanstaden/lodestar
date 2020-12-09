import {ContainerType} from "@chainsafe/ssz";
import * as t from "./types";

export interface ILightclientSSZTypes {
  SyncCommittee: ContainerType<t.BeaconBlock>;
  BeaconBlock: ContainerType<t.BeaconBlock>;
  BeaconBlockHeader: ContainerType<t.BeaconBlockHeader>;
  BeaconState: ContainerType<t.BeaconState>;
}