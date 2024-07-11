import type { Position } from "./misc";
export enum NetworkerEventType {
    PLAYER_SENT_PACKET,
    SERVER_RECEIVED_PACKET,
    PLAYER_RECEIVED_PACKET,
};
export type PlayerSentPacketEvent = {
    type: NetworkerEventType.PLAYER_SENT_PACKET;
    id: number;
    dropped: boolean;
    data: Position,
    senderPlayerId: string;
};
export type ServerReceivedPacketEvent = {
    type: NetworkerEventType.SERVER_RECEIVED_PACKET;
    id: number;
    data: Position,
    ping: number;
    senderPlayerId: string;
};
export type PlayerReceivedPacketEvent = {
    type: NetworkerEventType.PLAYER_RECEIVED_PACKET;
    id: number;
    dropped: boolean;
    data: Position;
    ping: number;
    senderPlayerId: string;
    receiverPlayerId: string;
};
export type NetworkerEvent = PlayerSentPacketEvent | ServerReceivedPacketEvent | PlayerReceivedPacketEvent;
