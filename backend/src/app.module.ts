import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { AchievementModule } from './achievement/achievement.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ChallengeModule } from './challenge/challenge.module';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { GlobalAchievementModule } from './global-achievement/global-achievement.module';
import { MultiplayerModule } from './Multiplayer/multiplayer.module';
import { MultiplayerGateWay } from './Multiplayer/MultiplayerGateWay.gateway';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { CacheModule } from '@nestjs/cache-manager';
import { join } from 'path';

const imports = [
  AuthModule,
  PrismaModule,
  ScheduleModule.forRoot(),
  ConfigModule.forRoot({
    isGlobal: true
  }),
  CacheModule.register({
    isGlobal: true,
    ttl: 60 * 1000, // 60 seconds
  }),
  ChallengeModule,
  UserModule,
  AchievementModule,
  GlobalAchievementModule,
  EmailSenderModule,
  MultiplayerModule
]

if(process.env.SOFTWARE_ENVIRONMENT === 'production') {
  imports.push(ServeStaticModule.forRoot({
    rootPath: join(__dirname, '../../', 'frontend', 'dist'),
  }))
}

@Module({
  imports: imports,
  controllers: [AppController],
  providers: [AppService, MultiplayerGateWay],
})
export class AppModule {}
