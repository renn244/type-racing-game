import { Module } from '@nestjs/common';
import { GlobalAchievementService } from './global-achievement.service';
import { GlobalAchievementController } from './global-achievement.controller';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  imports: [AchievementModule],
  providers: [GlobalAchievementService],
  controllers: [GlobalAchievementController]
})
export class GlobalAchievementModule {}
