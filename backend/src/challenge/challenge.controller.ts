import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { CreateChallengeDto } from './dto/CreateChallenge.dto';
import { ChallengeResultDto } from './dto/ChallengeResult.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { ChallengeCategory } from '@prisma/client';
import { JwtOptionalGuard } from 'src/guard/OptionalJwtGuard';
import { AdminOnlyGuard } from 'src/guard/AdminOnlyGuard';

@Controller('challenge')
export class ChallengeController {
    constructor(
        private readonly challengeService: ChallengeService
    ) {}

    @Post('autoCorrect')
    async autoCorrect(@Body() body: { search: string }) {
        return this.challengeService.autoCorrect(body)
    }

    @UseGuards(JwtAuthGuard, AdminOnlyGuard)
    @Get('getAll')
    async getAllChallenges(@Query() query: { page: string, search: string }) {
        return this.challengeService.getChallenges(query)
    }
    
    @UseGuards(JwtOptionalGuard)
    @Get('getChallengesForUser')
    async getChallengesForUser(@Query() query: { search: string, category: ChallengeCategory}, @Request() req: any) {
        return this.challengeService.getChallengesForUser(query, req)
    }

    @Get('getChallenge')
    async getChallenge(@Query('challengeId') challengeId: string) {
        return this.challengeService.getChallenge(challengeId)
    }

    @UseGuards(JwtAuthGuard)
    @Post('challengeResult')
    async createChallengeResult(@Body() body: ChallengeResultDto, @Request() req: any) {
        return this.challengeService.createChallengeResult(body, req)
    }
        
    @UseGuards(JwtAuthGuard, AdminOnlyGuard)
    @Post('createChallenge') 
    async createChallenge(@Request() req: any, @Body() body: CreateChallengeDto) {
        return this.challengeService.createChallenge(body, req)
    }

    @UseGuards(JwtAuthGuard, AdminOnlyGuard)
    @Patch('editChallenge/:id')
    async patchChallenge(@Body() body: CreateChallengeDto, @Param('id') id: string) {
        return this.challengeService.patchChallenge(body, id)
    }

    @UseGuards(JwtAuthGuard, AdminOnlyGuard)
    @Delete('deleteChallenge/:id')
    async deleteChallenge(@Param('id') id: string) {
        return this.challengeService.deleteChallenge(id)
    }
}
