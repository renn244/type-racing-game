import { AchievementCategory, TaskType } from '@prisma/client';
import { IsString, IsEnum, IsNumber, IsOptional } from 'class-validator';

export class CreateGlobalAchievementDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    goal: number;

    @IsNumber()
    @IsOptional()
    occurrence: number;

    @IsEnum(TaskType)
    taskType: TaskType;

    @IsEnum(AchievementCategory)
    category: AchievementCategory;
}
