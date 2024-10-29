import { PartialType } from '@nestjs/mapped-types';
import { CreateChallengeDto } from './CreateChallenge.dto';

export class UpdateChallengeDto extends PartialType(CreateChallengeDto) {}