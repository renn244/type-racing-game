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
import { GlobalAchievementModule } from './global-achievement/global-achievement.module';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { MultiplayerGateWay } from './Multiplayer/MultiplayerGateWay.gateway';
import { MultiplayerModule } from './multiplayer/multiplayer.module';

@Module({
  imports: [AuthModule, PrismaModule, 
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true
    }), ChallengeModule, UserModule, AchievementModule, GlobalAchievementModule, EmailSenderModule, MultiplayerModule],
  controllers: [AppController],
  providers: [AppService, MultiplayerGateWay],
})
export class AppModule {}
