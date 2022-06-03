import {expect} from "chai";
import {PeerId} from "@libp2p/interface-peer-id";
import {getValidPeerId} from "../../../utils/peer.js";

describe("network / peers / discover", () => {
  it("PeerId API", () => {
    const peerId = getValidPeerId();
    const peerIdStr = peerId.toString();
    const peerFromHex = PeerId.createFromB58String(peerIdStr);
    expect(peerFromHex.toString()).to.equal(peerIdStr);
  });
});
