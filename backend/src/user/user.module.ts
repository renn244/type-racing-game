import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ChallengeModule } from 'src/challenge/challenge.module';

@Module({
  imports: [ChallengeModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
