import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { send } from 'process';
import { PrismaService } from 'src/prisma/prisma.service';
import { MultiplayerGateWay } from './MultiplayerGateWay.gateway';
import { Prisma } from '@prisma/client';

@Injectable()
export class MultiplayerService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly MultiplayerGateway: MultiplayerGateWay
    ) {}

    async updateRoomPlayers(roomId: string) {
        try {
            const room = await this.prisma.room.findUnique({
                where: {
                    id: roomId
                },
                include: {
                    players: {
                        include: {
                            user: {
                                select: {
                                    id: true,
                                    profile: true
                                }
                            }
                        }
                    }
                }
            });

            await Promise.all(
                room.players.map(async (currplayer) => {
                    const socketId = await this.MultiplayerGateway.getSocketId(currplayer.user.id);
                    if (socketId) {
                        this.MultiplayerGateway.io.to(socketId).emit('player-joined', 
                            room.players.map(player => (
                                {
                                    playerId: player.id,
                                    roomId: room.id,
                                    username: player.username,
                                    profile: player.user.profile,
                                    progress: 0
                                }
                            ))
                        );
                    }
                })
            );
        } catch (error) {
            throw new InternalServerErrorException('error updating room players');
        }
    }

    async createMultiplayerRoom(data: any, req: any) {
        const playerId = req.user.player.id;

        const CreateRoomTransaction = await this.prisma.$transaction(async (tprisma) => {
            // deleting all the existing room at the time
            await this.prisma.room.deleteMany({
                where: {
                    hostId: playerId
                }
            });

            const room = await tprisma.room.create({
                data: {
                    challengeId: data.challengeId,
                    name: data.name,
                    hostId: playerId
                }
            });

            const player = await tprisma.player.update({
                where: {
                    id: playerId
                },
                data: {
                    roomId: room.id
                }
            });

            return room;
        })

        await this.updateRoomPlayers(CreateRoomTransaction.id);

        return CreateRoomTransaction;
    }

    async joinRoom(data: { roomId: string }, req: any) {
        const playerId = req.user.player.id;

        const room = await this.prisma.room.findUnique({
            where: {
                id: data.roomId
            }
        });

        if(!room) {
            throw new NotFoundException('room not found');
        }
        const player = await this.prisma.player.update({
            where: {
                id: playerId
            },
            data: {
                roomId: room.id
            }
        });

        // just deleting the privous room
        await this.prisma.room.deleteMany({
            where: {
                hostId: playerId
            }
        })

        await this.updateRoomPlayers(room.id);

        return { message: 'Successfully joined room!', challengeId: room.challengeId , roomId: room.id };
    }

    async sendInvite(data: { username, roomId }, req: any) {

        const getPlayer = await this.prisma.user.findFirst({
            where: {
                username: data.username
            },
            include: {
                Player: true
            }
        })

        if(!getPlayer) {
            throw new NotFoundException({
                name: 'user',
                message: 'username does not exist!'
            });
        }

        const playerId = req.user.player.id; // add later

        const existingInvite = await this.prisma.invitation.findFirst({
            where: {
                roomId: data.roomId,
                senderId: playerId,
                receiverId: getPlayer.Player.id,
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
                receiverId: getPlayer.Player.id
            },
            include: {
                user: true // this is the one who is sending the invite
            }
        })

        // for notifications
        const receiverSocketId = await this.MultiplayerGateway.getSocketId(getPlayer.id);
        if(receiverSocketId) {
            this.MultiplayerGateway.io.to(receiverSocketId).emit('invitation', invite)
        }

        return { message: 'Successfully sent invite!', invite };
    }

    async acceptInvite(inviteId: string, req: any) {
        try {
            const playerId = req.user.player.id;

            const invite = await this.prisma.invitation.update({
                where: {
                    id: inviteId
                },
                data: {
                    status: 'accepted'
                }
            })

            return this.joinRoom({ roomId: invite.roomId }, req);

        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('invite not found');
                }
            }
            throw new InternalServerErrorException('error accepting invite');
        }
    }

    async rejectInvite(inviteId: string) {
       try {
            const invite = await this.prisma.invitation.update({
                where: {
                    id: inviteId
                },
                data: {
                    status: 'rejected'
                }, include: {
                    user: true, // sender of the invite
                    receiver: true
                }
            })

            // for notifications
            const senderSocketId = await this.MultiplayerGateway.getSocketId(invite.user.userId);
            if(senderSocketId) {
                this.MultiplayerGateway.io.to(senderSocketId).emit('invitation-rejected', `invitation rejected by ${invite.receiver.username}`);
            }
            
            return {
                message: 'Successfully rejected invite!'
            }
       } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
              if (error.code === 'P2025') {
                   throw new NotFoundException('invite not found');
              }
            }
            throw new InternalServerErrorException('error rejecting invite');
       }
    }
}
