import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/CreateChallenge.dto';
import { query } from 'express';
import { ChallengeResultDto } from './dto/ChallengeResult.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('challenge')
export class ChallengeController {
    constructor(
        private readonly challengeService: ChallengeService
    ) {}

    @Get('getAll')
    async getAllChallenges(@Query() query: { page: string, search: string }) {
        return this.challengeService.getChallenges(query)
    }
    
    @Get('getChallenge')
    async getChallenge(@Query('challengeId') challengeId: string) {
        return this.challengeService.getChallenge(challengeId)
    }

    @UseGuards(JwtAuthGuard)
    @Post('challengeResult')
    async createChallengeResult(@Body() body: ChallengeResultDto, @Request() req: any) {
        return this.challengeService.createChallengeResut(body, req)
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
