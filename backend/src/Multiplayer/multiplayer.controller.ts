import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { MultiplayerService } from './multiplayer.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('multiplayer')
export class MultiplayerController {
    constructor(
        private readonly multiplayerService: MultiplayerService
    ) {}

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
    async sendInvite(@Body() data: { playerId, roomId }, @Request() req: any) {
        return this.multiplayerService.sendInvite(data, req);
    }

    @UseGuards(JwtAuthGuard)
    @Post('acceptInvite')
    async acceptInvite(@Body() data: { inviteId }, @Request() req: any) {
        return this.multiplayerService.acceptInvite(data.inviteId, req);
    }
}
