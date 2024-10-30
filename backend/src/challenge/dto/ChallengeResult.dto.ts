import { IsString, IsNumber, isNumber } from 'class-validator' 

export class ChallengeResultDto {
    @IsString()
    challengeId: string;
    @IsString()
    typed: string;

    @IsNumber()
    accuracy: number;
    @IsNumber()
    wpm: number;
    @IsNumber()
    time: number;
}