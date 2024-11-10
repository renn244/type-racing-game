import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { AchievementCategory, Prisma, TaskType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { InternalServerError } from 'openai';

@Injectable()
export class AchievementService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async addUserAchievement(achievementId: string) {
        const users = await this.prisma.user.findMany()
        
        const userAchievements = await Promise.all(
            users.map(async (user) => {
                return await this.createUserAchievement(user.id, achievementId);
            })
        );

        return userAchievements
    }

    async createUserAchievement(userId: string, achievementId: string) {
        try {
            // Create the UserAchievement entry
            return await this.prisma.userAchievement.create({
                data: {
                    userId: userId,
                    achievementId: achievementId,
                },
            });
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    return new BadRequestException({
                        name: error.meta.target,
                        message: "achievement already Exist on this user"
                    })
                }
            } 
            throw new InternalServerErrorException("internal server error")
        }
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

        const updatePromises = await userInfo.Achievements.map(async userAchievement => {
            const globalAchievement = userAchievement.achievement;

            if(userAchievement.isFinished) return;

            if(globalAchievement.taskType == TaskType.Milestone) {
                return await this.recalculateMilestoneAchievement(userAchievement, userInfo);
            } else if (globalAchievement.taskType == TaskType.Process) {
                return await this.recalculateProcessAchievement(userAchievement, userInfo);
            }
        })

        return undefined;
    }

    async updateProgress(achievement: any, newProgress: number, taskType: TaskType) {
        const achievementBasis = taskType === "Milestone" ? achievement.achievement.goal : achievement.achievement.occurrence

        let query = {
            isFinished: false,
            progress: newProgress
        }

        if(newProgress >= achievementBasis) {
            query = {
                isFinished: true,
                progress: achievementBasis
            }
        }

        return await this.prisma.userAchievement.update({
            where: {
                id: achievement.id
            },
            data: {
                ...query
            }
        })
    }

    async recalculateProcessAchievement(achievement: any, userInfo: any) {
        // new progress is about the occurence of the process taskType of the achievement
        let newProgress = achievement.progress;
        const category = achievement.achievement.category
        
        if(category === AchievementCategory.WPM) {
            const highestWpmComplete = Math.max(...userInfo.completedChallenges.map(
                challenge => challenge.wpm >= achievement.achievement.goal
            ), 0);

            newProgress = highestWpmComplete;
        } else if (category === AchievementCategory.Accuracy) {
            const highestAccuracy = Math.max(...userInfo.completedChallenges.map(
                challenge => challenge.accuracy >= achievement.achievement.goal
            ), 0);
            newProgress = highestAccuracy;
        }
        console.log(newProgress, achievement.progress)
        if(newProgress !== achievement.progress) {
            return await this.updateProgress(achievement, newProgress, 'Process')
        }

        return undefined;
    }

    async recalculateMilestoneAchievement(achievement, userInfo) {
        // this will just be goal because milestone don't use occurrence
        let newProgress = achievement.progress;
        const category = achievement.achievement.category;

        if(category === AchievementCategory.Challenges) {
            newProgress = userInfo.completedChallenges.length;
        } else if (category === AchievementCategory.WPM) {
            newProgress = userInfo.Biometrics.AverageWpm;
        } else if (category === AchievementCategory.Accuracy) {
            newProgress = userInfo.Biometrics.AverageAccuracy;
        }

        if(newProgress !== achievement.progress) {
           return  await this.updateProgress(achievement, newProgress, "Milestone")
        }

        return undefined;
    }
}


// const updatePromises = userInfo.Achievements.map(async userAchievement => {
//     const achievement = userAchievement.achievement;

//     let newProgress = userAchievement.progress;

//     // Calculate new progress based on achievement category
//     if (achievement.category === AchievementCategory.Challenges) {   
//         newProgress = userInfo.completedChallenges.length; // Count of completed challenges
//     } else if (achievement.category === AchievementCategory.WPM) {
//         if (achievement.taskType === TaskType.Milestone) {
//             newProgress = userInfo.Biometrics.AverageWpm; // Average WPM for milestone
//         } else if (achievement.taskType === TaskType.Process) {
//             const highestWpm = Math.max(...userInfo.completedChallenges.map(challenge => challenge.wpm), 0);
//             newProgress = highestWpm; // Highest WPM for cumulative process
//         }
//     } else if (achievement.category === AchievementCategory.Accuracy) {
//         if (achievement.taskType === TaskType.Milestone) {
//             newProgress = userInfo.completedChallenges.reduce((acc, challenge) => {
//                 return challenge.accuracy >= achievement.goal ? acc + 1 : acc; // Count challenges above the goal
//             }, 0);
//         } else if (achievement.taskType === TaskType.Process) {
//             newProgress = userInfo.Biometrics.AverageAccuracy; // Average accuracy for cumulative process
//         }
//     }

//     // Update only if progress has changed
//     if (newProgress !== userAchievement.progress) {
//         await this.prisma.userAchievement.update({
//             where: { id: userAchievement.id },
//             data: { progress: newProgress }
//         });
//     }
// });