import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/CreateChallenge.dto';

@Controller('challenge')
export class ChallengeController {
    constructor(
        private readonly challengeService: ChallengeService
    ) {}

    @Get('getAll')
    async getAllChallenges(@Query() query: { page: string, search: string }) {
        return this.challengeService.getChallenges(query)
    }
    
    @Post('createChallenge') 
    async createChallenge(@Request() req: any, @Body() body: CreateChallengeDto) {
        return this.challengeService.createChallenge(body, req)
    }

    @Post('autoCorrect')
    async autoCorrect(@Body() body: { search: string }) {
        return this.challengeService.autoCorrect(body)
    }

    @Patch('editChallenge/:id')
    async patchChallenge(@Body() body: CreateChallengeDto, @Param('id') id: string) {
        return this.challengeService.patchChallenge(body, id)
    }

    @Delete('deleteChallenge/:id')
    async deleteChallenge(@Param('id') id: string) {
        return this.challengeService.deleteChallenge(id)
    }
}
