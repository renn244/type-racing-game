import { Body, Controller, Get, Post, Query, Request, UseGuards } from '@nestjs/common';
import { MultiplayerService } from './multiplayer.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('multiplayer')
export class MultiplayerController {
    constructor(
        private readonly multiplayerService: MultiplayerService
    ) {}

    @UseGuards()
    @Get('roomPlayers')
    async getRoomPlayers(@Request() req: any, @Query('roomId') roomId: string) {
        return this.multiplayerService.getRoomPlayers(roomId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('createRoom')
    async createRoom(@Body() data: {
        name: string // room name?
    }, @Request() req: any) {
        return this.multiplayerService.createMultiplayerRoom(data, req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('joinRoom')
    async joinRoom(@Body() data: { roomId: string }, @Request() req: any) {
        return this.multiplayerService.joinRoom(data, req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('sendInvite')
    async sendInvite(@Body() data: { username, roomId }, @Request() req: any) {
        return this.multiplayerService.sendInvite(data, req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('acceptInvite')
    async acceptInvite(@Body() data: { inviteId }, @Request() req: any) {
        return this.multiplayerService.acceptInvite(data.inviteId, req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('rejectInvite')
    async rejectInvite(@Body() data: { inviteId }) {
        return this.multiplayerService.rejectInvite(data.inviteId);
    }

    @UseGuards(JwtAuthGuard)
    @Post('playerReady')
    async playerReady(@Request() req: any, @Body() data: { Ready: boolean }) {
        return this.multiplayerService.playerReady(req, data);
    }
}
