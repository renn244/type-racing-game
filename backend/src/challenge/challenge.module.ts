import { Module } from '@nestjs/common';
import { ChallengeService } from './challenge.service';
import { ChallengeController } from './challenge.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AchievementModule } from 'src/achievement/achievement.module';

@Module({
  imports: [PrismaModule, AchievementModule],
  providers: [ChallengeService],
  controllers: [ChallengeController],
  exports: [ChallengeService]
})
export class ChallengeModule {}
