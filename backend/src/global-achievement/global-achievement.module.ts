import { Module } from '@nestjs/common';
import { GlobalAchievementService } from './global-achievement.service';
import { GlobalAchievementController } from './global-achievement.controller';

@Module({
  providers: [GlobalAchievementService],
  controllers: [GlobalAchievementController]
})
export class GlobalAchievementModule {}
