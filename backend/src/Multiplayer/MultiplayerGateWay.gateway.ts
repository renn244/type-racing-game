import { Logger } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
 
@WebSocketGateway()
export class MultiplayerGateWay implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private logger = new Logger(MultiplayerGateWay.name);

    private playerToSocket: Record<string, string> = {};
    private socketToPlayer: Record<string, string> = {};


    @WebSocketServer() io: Server;

    afterInit() {
        this.logger.log("MultiplayerGateWay initialized");
    }

    async getPlayerId(socketId: string) {
        return this.socketToPlayer[socketId];
    }

    async getSocketId(playerId: string) {
        return this.playerToSocket[playerId];
    }

    async handleConnection(client: any, ...args: any[]) {
        const userId = client.handshake.query.userId;
        this.playerToSocket[userId] = client.id;
        this.socketToPlayer[client.id] = userId;
        // for development only
        this.logger.log("Client connected: " + userId);
    }

    async handleDisconnect(client: any) {
        const socketId = client.id;
        const userId = await this.getPlayerId(socketId); // only used for logging
        if (userId) {
            this.logger.log('Client disconnected ' + userId);
            delete this.socketToPlayer[socketId];
            delete this.playerToSocket[userId];
        } else {
            this.logger.warn('Attempt to disconnect unknown client: ' + socketId);
        }

    }

    // socket Id or userId??

    @SubscribeMessage('send-invite')
        async handleSendInvite(@ConnectedSocket() socket: Socket, @MessageBody() data: { roomId: string, inviteeId: string }) {
        // Backend logic for sending invites is now handled by API
        this.io.to(await this.getSocketId(data.inviteeId)).emit('invite-received', {
            roomId: data.roomId,
            senderId: socket.id, // Assuming socket.id is the playerId of the sender
        });
    }

    @SubscribeMessage('accept-invite')
        async handleAcceptInvite(@ConnectedSocket() socket: Socket, @MessageBody() data: { roomId: string }) {
        // Backend logic for accepting invites is now handled by API
        this.io.to(data.roomId).emit('player-joined', { playerId: socket.id });
    }
    
}