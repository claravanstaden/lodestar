import PeerId from "peer-id";
import {PeerMap} from "../../../util/peerMap";

export class PeerMapDelay {
  interval: number;
  lastMsMap = new PeerMap<number>();
  constructor(interval: number) {
    this.interval = interval;
  }

  /** timeToReq = 0 -> Request as soon as pingAndStatusTimeouts() is called */
  requestNow(peer: PeerId): void {
    this.requestAfter(peer, -1);
  }

  /** timeToReq = now() -> Request after `INTERVAL` */
  requestAfter(peer: PeerId, ms = this.interval): void {
    this.lastMsMap.set(peer, Date.now() - this.interval + ms);
  }

  /** Return array of peers with expired interval + call requestAfter on them */
  pollNext(): PeerId[] {
    const peers: PeerId[] = [];
    for (const [peer, lastMs] of this.lastMsMap.entries()) {
      if (Date.now() - lastMs > this.interval) {
        this.requestAfter(peer);
        peers.push(peer);
      }
    }
    return peers;
  }

  delete(peer: PeerId): boolean {
    return this.lastMsMap.delete(peer);
  }
}