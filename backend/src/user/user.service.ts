import { Injectable } from '@nestjs/common';
import { ChallengeService } from 'src/challenge/challenge.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly challengeService: ChallengeService
    ) {}

    async getProfile(userId: string) {

    }

    async getDashboardInformation(req: any) {
        const userId = req.user.sub;

        const DashboardInformation = await this.prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                Biometrics: true,
                userinfo: true,
                completedChallenges: {
                    include: {
                        challenge: {
                            select: {
                                id: true,
                                title: true,
                                difficulty: true,
                                createdAt: true
                            }
                        }
                    }
                }
            }
        })

        const response = {
            ...DashboardInformation,
            dailyChallengeId: this.challengeService.DailyChallengeId
        }

        return response
    }

    // implemet setting where they can change information about them
}
