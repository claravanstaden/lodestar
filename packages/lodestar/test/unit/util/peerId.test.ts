import {expect} from "chai";
import {createFromPrivKey} from "peer-id";
import {fromHexString, toHexString} from "@chainsafe/ssz";
import {createSecp256k1PeerId} from "../../../src/network/index.js";

describe("PeerId util - for multithread sim test", () => {
  it("Should serialize and deserialize privKey", async () => {
    const peerId = await createSecp256k1PeerId();
    const privKey = peerId.marshalPrivKey();
    const privKeyHex = toHexString(privKey);
    const peerIdRecov = await createFromPrivKey(fromHexString(privKeyHex));
    expect(peerId.toString()).to.equal(peerIdRecov.toString());
  });
});
