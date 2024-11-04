import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { ChallengeModule } from './challenge/challenge.module';
import { UserModule } from './user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { AchievementModule } from './achievement/achievement.module';

@Module({
  imports: [AuthModule, PrismaModule, 
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true
    }), ChallengeModule, UserModule, AchievementModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
