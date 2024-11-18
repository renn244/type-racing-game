import { Body, Controller, Post, Request } from '@nestjs/common';
import { MultiplayerService } from './multiplayer.service';

@Controller('multiplayer')
export class MultiplayerController {
    constructor(
        private readonly multiplayerService: MultiplayerService
    ) {}

    @Post('createRoom')
    async createRoom(@Body() data: {
        name: string // room name?
    }, @Request() req: any) {
        return this.multiplayerService.createMultiplayerRoom(data, req);
    }

    @Post('sendInvite')
    async sendInvite(@Body() data: { playerId, roomId }, @Request() req: any) {
        return this.multiplayerService.sendInvite(data, req);
    }

    @Post('acceptInvite')
    async acceptInvite(@Body() data: { inviteId }, @Request() req: any) {
        return this.multiplayerService.acceptInvite(data.inviteId, req);
    }
}
