import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { ChallengeModule } from 'src/challenge/challenge.module';
import { FileUploadModule } from 'src/file-upload/file-upload.module';

@Module({
  imports: [ChallengeModule, FileUploadModule],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
