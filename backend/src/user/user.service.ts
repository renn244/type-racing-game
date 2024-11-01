import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { ChallengeService } from 'src/challenge/challenge.service';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { UpdateAccount, UpdatePassword } from './dto/UpdateAccount.dto';

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

    // this is use for settings
    async getUserInformation(req: any) {
        const userId = req.user.sub;

        // will add other queryies in the future
        const userInformation = await this.prisma.user.findFirst({
            where: {
                id: userId,
            },
            select: {
                id: true,
                email: true,
                username: true,
                profile: true,
                userinfo: true,
            }
        })
        

        if (!userInformation) {
            throw new NotFoundException({
                name: 'User Information',
                message: 'User Info not Found'
            })
        }

        return userInformation
    }

    async uploadProfile(profile: Express.Multer.File, userId: string) {
        
        const pathFile = process.env.BASE_BACKEND_URL + "/" +  profile.path.split('\\').join('/')

        const updateProfile = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                profile: pathFile
            }
        })

        return updateProfile
    }

    async updateAccount(body: UpdateAccount, profile: Express.Multer.File, req: any) {
        const userId = req.user.sub;
        
        if (profile) {
            await this.uploadProfile(profile, userId)
        }

        const updateInformation = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                username: body.username,
                email: body.email
            }
        })

        return updateInformation
    } 

    async updatePassword(body: UpdatePassword, req: any) {
        const userId = req.user.sub;

        if(body.newPassword !== body.confirmPassword) {
            return new GoneException({
                name: 'confirmPassword',
                message: 'confirmPassword does not match'
            })
        }

        const getPassword = await this.prisma.user.findFirst({
            where: {
                id: userId
            },
            select: {
                password: true
            }
        })

        const verifyPassoword = await bcrypt.compare(body.password, getPassword.password)

        if(!verifyPassoword) {
            throw new GoneException({
                name: 'Password',
                message: 'wrong password'
            })
        }

        const hashedPassword = await bcrypt.hash(body.newPassword, 10)

        const updateUserPassword = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                password: hashedPassword
            }
        })

        return updateUserPassword
    }
}
