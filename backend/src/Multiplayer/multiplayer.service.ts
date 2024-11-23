import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
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

            if(!room) return

            await Promise.all(
                room.players.map(async (currplayer) => {
                    const socketId = await this.MultiplayerGateway.getSocketId(currplayer.user.id);
                    if (socketId) {
                        this.MultiplayerGateway.io.to(socketId).emit('update-playerLobby', 
                            room.players.map(player => (
                                {
                                    playerId: player.id,
                                    roomId: room.id,
                                    username: player.username,
                                    profile: player.user.profile,
                                    progress: 0,
                                    Ready: player.Ready
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

    async getRoomPlayers(roomId: string) {
        try {
            // maybe check if he is part of the room?
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

            if(!room) {
                throw new NotFoundException('room not found');
            }

            return room.players.map(player => (
                {
                    playerId: player.id,
                    roomId: room.id,
                    username: player.username,
                    profile: player.user.profile,
                    progress: 0,
                    Ready: player.Ready
                }
            ))
        } catch {
            throw new InternalServerErrorException("error try refreshing the page!")
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
                    roomId: room.id,
                    Ready: false
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
                roomId: room.id,
                Ready: false, // setting ready as false
                isFinished: false,
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
        
        if(getPlayer.Player.id === playerId) {
            throw new NotFoundException('you cannot invite yourself');
        }

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

    async playerReady(req: any, data: { Ready: boolean }) {
        const playerId = req.user.player.id;
        const updatePlayer = await this.prisma.player.update({
            where: {
                id: playerId
            },
            data: {
                Ready: data.Ready
            }
        })

        await this.updateRoomPlayers(updatePlayer.roomId);

        // check if all the players are ready and then use the socket to start the game
        const room = await this.prisma.room.findUnique({
            where: {
                id: updatePlayer.roomId
            },
            include: {
                players: {
                    select: {
                        Ready: true
                    }
                }
            }
        });

        const allReady = room.players.every(player => player.Ready === true);
        const roomPlayerCount = room.players.length;

        if (allReady && roomPlayerCount > 1) {

            const updateGameStatus = await this.prisma.room.update({
                where: {
                    id: updatePlayer.roomId
                },
                data: {
                    roomStatus: 'started'
                },
                // getting the users to send that the game has started
                include: {
                    players: {
                        select: {
                            user: true
                        }
                    }
                }
            })

            // send the start signal to all the players
            await Promise.all(
                updateGameStatus.players.map(async player => {
                    const socketId = await this.MultiplayerGateway.getSocketId(player.user.id);
                    if (socketId) {
                        this.MultiplayerGateway.io.to(socketId).emit('game-started', updateGameStatus);
                    }
                })
            );
        }

        return { message: "player is ready"};
    }

    async leaveRoom(req: any) {
        const playerId = req.user.player.id;
        const player = await this.prisma.player.findUnique({
            where: {
                id: playerId
            }
        });

        if(!player) {
            throw new NotFoundException('player not found');
        }

        const room = await this.prisma.room.findUnique({
            where: {
                id: player.roomId
            },
            include: {
                players: true
            }
        });

        if(!room) {
            throw new NotFoundException('room not found');
        }

        if(room.hostId === playerId && room.players.length > 1) {
            console.log('host is leaving');
            // if the host is leaving then the room is deleted
            await this.prisma.room.update({
                where: {
                    id: room.id
                },
                data: {
                    hostId: room.players[1].id
                }
            });
        } else if(room.hostId === playerId) { 
            console.log('host is leaving');
            // if the host is leaving and he is the only one then the room is deleted
            await this.prisma.room.delete({
                where: {
                    id: room.id
                }
            });
        }

        await this.prisma.player.update({
            where: {
                id: playerId
            },
            data: {
                roomId: null,
                Ready: false,
                isFinished: false,
            }
        });

        await this.updateRoomPlayers(player.roomId);

        return { message: 'Successfully left room!' };
    }
}   
