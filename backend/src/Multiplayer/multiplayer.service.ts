import { Injectable, NotFoundException } from '@nestjs/common';
import { send } from 'process';
import { PrismaService } from 'src/prisma/prisma.service';
import { MultiplayerGateWay } from './MultiplayerGateWay.gateway';

@Injectable()
export class MultiplayerService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly MultiplayerGateway: MultiplayerGateWay
    ) {}

    async createMultiplayerRoom(data: any, req: any) {
        const userId = req.user.player.id;

        const CreateRoomTransaction = await this.prisma.$transaction(async (tprisma) => {

            const room = await tprisma.room.create({
                data: {
                    name: data.name,
                    hostId: userId
                }
            });

            const player = await tprisma.player.update({
                where: {
                    id: userId
                },
                data: {
                    roomId: room.id
                }
            });

            return room;
        })

        return CreateRoomTransaction;
    }

    async sendInvite(data: { playerId, roomId }, req: any) {
        const playerId = req.user.player.id; // add later

        const existingInvite = await this.prisma.invitation.findFirst({
            where: {
                roomId: data.roomId,
                senderId: playerId,
                receiverId: data.playerId,
                status: 'pending'
                // maybe impleemt date check to further check if spamming invite?
            }
        })

        if(existingInvite) {
            throw new NotFoundException('invite already sent');
        }

        const invite = await this.prisma.invitation.create({
            data: {
                roomId: data.roomId,
                senderId: playerId,
                receiverId: data.playerId
            }
        })

        // for notifications
        const receiverSocketId = await this.MultiplayerGateway.getSocketId(data.playerId);
        if(receiverSocketId) {
            this.MultiplayerGateway.io.to(receiverSocketId).emit('invitation', {
                roomId: data.roomId,
                senderId: playerId
            })
        }

        return { message: 'Successfully sent invite!', invite };
    }

    async acceptInvite(inviteId: string, req: any) {
        const playerId = req.user.player.id;

        const invite = await this.prisma.invitation.update({
            where: {
                id: inviteId
            },
            data: {
                status: 'accepted'
            }
        })

        const room = await this.prisma.room.findUnique({
            where: {
                id: invite.roomId
            },
            include: {
                players: true
            }
        })

        if(!room) {
            throw new NotFoundException('room not found');
        }

        const playerJoin = await this.prisma.player.update({
            where: {
                id: req.user.player.id
            },
            data: {
                roomId: room.id
            }
        })

        await Promise.all(
            room.players.map(async (player) => {
                const socketId = await this.MultiplayerGateway.getSocketId(player.id);
                if (socketId) {
                    this.MultiplayerGateway.io.to(socketId).emit('player-joined', {
                        playerId,
                        roomId: room.id
                    });
                }
            })
        );

        return {
            message: 'Successfully joined room!',
            roomId: room.id
        }
    }
}
