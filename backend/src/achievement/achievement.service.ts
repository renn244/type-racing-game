import { AchievementCategory, Prisma, TaskType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGlobalAchievementDto } from './dto/createAchievement.dto';
import { GoneException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

@Injectable()
export class AchievementService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    
    async getGlobalAchievements() {
        const achievements = await this.prisma.globalAchievements.findMany();
        
        return achievements
    }

    async getGlobalAchievementById(id: string) {
        const achievement = await this.prisma.globalAchievements.findUnique({
            where: {
                id: id
            }
        });

        if(!achievement) {
            throw new NotFoundException({
                name: "achievement",
                message: "Achievement not found"
            })
        }
        
        return achievement;        
    }

    async createGlobalAchievement(body: CreateGlobalAchievementDto) {
        const achievement = await this.prisma.globalAchievements.create({
            data: {
                ...body
            }
        });

        return achievement;
    }

    async deleteGlobalAchievement(id: string) {
        try {
            const achievement = await this.prisma.globalAchievements.delete({
                where: {
                    id: id
                }
            });

            return achievement;
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    throw new NotFoundException({
                        name: "achievement",
                        message: "Achievement not found"
                    })
                }
                throw new GoneException('unknown error in the database')
            }
            throw new InternalServerErrorException('internal server erro')
        }
    }

    async updateGlobalAchievement(id: string, body: CreateGlobalAchievementDto) {
        try {
            const achievement = await this.prisma.globalAchievements.update({
                where: {
                    id: id
                },
                data: {
                    ...body
                }
            });
    
            return achievement;
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2025') {
                    throw new NotFoundException({
                        name: "achievement",
                        message: "Achievement not found"
                    })
                }
                throw new GoneException('unknown error in the database')
            }
            throw new InternalServerErrorException('internal server erro')
        }
    }

    async createUserAchievement(userId: string, achievementId: string) {
        const achievement = await this.prisma.userAchievement.create({
            data: {
                userId: userId,
                achievementId: achievementId
            }
        });

        return achievement;
    }

    async createUserAllTheAchievements(userId: string) {
        const achievements = await this.prisma.globalAchievements.findMany();

        const userAchievements = achievements.map(async achievement => {
            return await this.createUserAchievement(userId, achievement.id);
        });

        return userAchievements;
    }

    // should thius be a cron job or a per challenge job?
    async recalculateUserAchievements(userId: string) {
        const userInfo = await this.prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                Achievements: {
                    include: {
                        achievement: true
                    }
                },
                completedChallenges: {
                    include: {
                        challenge: true
                    }
                },
                Biometrics: true
            }
        })

        if(!userInfo) {
            throw new NotFoundException({
                name: "user",
                message: "User not found"
            })
        }

        if(userInfo.Achievements.length === 0) {
            return 
        }

        const updatePromises = userInfo.Achievements.map(async userAchievement => {
            const achievement = userAchievement.achievement;
    
            let newProgress = userAchievement.progress;
    
            // Calculate new progress based on achievement category
            if (achievement.category === AchievementCategory.Challenges) {
                newProgress = userInfo.completedChallenges.length; // Count of completed challenges
            } else if (achievement.category === AchievementCategory.WPM) {
                if (achievement.taskType === TaskType.Milstone) {
                    newProgress = userInfo.Biometrics.AverageWpm; // Average WPM for milestone
                } else if (achievement.taskType === TaskType.Process) {
                    const highestWpm = Math.max(...userInfo.completedChallenges.map(challenge => challenge.wpm), 0);
                    newProgress = highestWpm; // Highest WPM for cumulative process
                }
            } else if (achievement.category === AchievementCategory.Accuracy) {
                if (achievement.taskType === TaskType.Milstone) {
                    newProgress = userInfo.completedChallenges.reduce((acc, challenge) => {
                        return challenge.accuracy >= achievement.goal ? acc + 1 : acc; // Count challenges above the goal
                    }, 0);
                } else if (achievement.taskType === TaskType.Process) {
                    newProgress = userInfo.Biometrics.AverageAccuracy; // Average accuracy for cumulative process
                }
            }
    
            // Update only if progress has changed
            if (newProgress !== userAchievement.progress) {
                await this.prisma.userAchievement.update({
                    where: { id: userAchievement.id },
                    data: { progress: newProgress }
                });
            }
        });

        return undefined;
    }
}
