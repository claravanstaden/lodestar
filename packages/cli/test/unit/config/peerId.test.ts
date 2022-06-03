import {expect} from "chai";
import {getTestdirPath} from "../../utils.js";
import {createPeerId, writePeerId, readPeerId} from "../../../src/config/index.js";

describe("config / peerId", () => {
  const peerIdFilepath = getTestdirPath("./test-peer-id.json");

  it("create, write and read PeerId", async () => {
    const peerId = await createPeerId();
    writePeerId(peerIdFilepath, peerId);
    const peerIdRead = await readPeerId(peerIdFilepath);

    expect(peerIdRead.toString()).to.equal(peerId.toString());
  });
});
