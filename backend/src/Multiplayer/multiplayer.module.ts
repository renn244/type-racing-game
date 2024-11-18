import { Module } from '@nestjs/common';
import { MultiplayerController } from './multiplayer.controller';
import { MultiplayerService } from './multiplayer.service';
import { MultiplayerGateWay } from './MultiplayerGateWay.gateway';

@Module({
  controllers: [MultiplayerController],
  providers: [MultiplayerService, MultiplayerGateWay]
})
export class MultiplayerModule {}
