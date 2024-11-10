import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { GlobalAchievementService } from './global-achievement.service';
import { CreateGlobalAchievementDto } from './dto/createAchievement.dto';
import { AdminOnlyGuard } from 'src/guard/AdminOnlyGuard';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard, AdminOnlyGuard)
@Controller('globalAchievement')
export class GlobalAchievementController {
    constructor(
        private readonly globalAchievementService: GlobalAchievementService
    ) {}

    @Get('getAllGlobalAchievements')
    async getAllGlobalAchievements(@Query() query: { page: string, search: string }) {
        return this.globalAchievementService.getGlobalAchievements(query);
    }

    @Get('getGlobalAchievementById')
    async getGlobalAchievementById(@Query('id') id: string) {
        return this.globalAchievementService.getGlobalAchievementById(id);
    }

    @Post('autoCorrect')
    async autoCorrect(@Body() body: { search: string }) {
        return this.globalAchievementService.autoCorrect(body);
    }

    @Post('createGlobalAchievement')
    async createGlobalAchievement(@Body() body: CreateGlobalAchievementDto) {
        return this.globalAchievementService.createGlobalAchievement(body);
    }

    @Delete('deleteGlobalAchievement')
    async DeleteGlobalAchievement(@Query('id') id: string) {
        return this.globalAchievementService.deleteGlobalAchievement(id);
    }

    @Patch('updateGlobalAchievement')
    async updateGlobalAchievement(@Query('id') id: string, @Body() body: CreateGlobalAchievementDto) {
        return this.globalAchievementService.updateGlobalAchievement(id, body);
    }
}
