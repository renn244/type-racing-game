import { GoneException, Injectable, NotFoundException } from '@nestjs/common';
import { ChallengeService } from '../challenge/challenge.service';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt'
import { UpdateAccount, UpdatePassword, UpdatePrivacy, UpdateTypePreferences, UpdateUserInfo } from './dto/UpdateAccount.dto';
import { provideSecret } from '../util/ProvideSecret';
import * as fs from 'fs'
import * as path from 'path'
@Injectable()
export class UserService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly challengeService: ChallengeService
    ) {}

    async getProfile(userId: string) {
        let includeQuery = {}
        const privatePreferences = await this.prisma.userPreferences.findFirst({
            where: {
                userId: userId
            },
            select: {
                privateProfile: true,
                showStats: true
            }
        })
        
        if(!privatePreferences) {
            throw new NotFoundException({
                name: 'user',
                message: 'user is not found'
            })
        }

        if(!privatePreferences.privateProfile) {
            includeQuery = {
                ...includeQuery,
                email: true,
                userinfo: true,
                completedChallenges: {
                    include: {
                        challenge:true
                    }
                },
            }

        }

        if(privatePreferences.showStats) {
            includeQuery = {
                ...includeQuery,
                Biometrics: true
            }
        }

        const ProfileInfo = await this.prisma.user.findUnique({
            where: {
                id: userId
            },
            select: {
                id: true,
                username: true,
                profile: true,
                createdAt: true,
                role: true,
                ...includeQuery
            }
        })

        return ProfileInfo
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
                preferences: true
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

    // fileLink should look like "http://localhost:5000/Uploads/e6c42da0152639392c0a_https___-28e83b26770f.jpg"
    async DeleteProfileFile(fileLink: string) {
        const fileName = fileLink.split('/')
        const completePath = path.join(__dirname, '../..', 'Uploads', 'avatar', fileName[fileName.length - 1])

        fs.unlink(completePath, (err) => {
            if (err) {
                // handleError
                return 'failed to delete'
            }
        })

        return fileName[fileName.length - 1] + " got deleted"
    }

    async uploadProfile(profile: Express.Multer.File, userId: string) {
        
        const pathFile = process.env.BASE_BACKEND_URL + "/" +  profile.path.split('\\').join('/')

        const doesProfileExist = await this.prisma.user.findFirst({
            where: {
                id: userId
            }, 
            select: {
                profile: true
            }
        })

        if(doesProfileExist) {
            this.DeleteProfileFile(doesProfileExist.profile)
        }

        const updateProfile = await this.prisma.user.update({
            where: {
                id: userId
            },
            data: {
                profile: pathFile
            },
            select: {
                profile: true
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
            },
            select: {
                username: true,
                email: true
            }
        })

        return updateInformation
    } 

    async updateUserInfo(body: UpdateUserInfo, req:any) {
        const userId = req.user.sub;

        const updateUserinfo = await this.prisma.userinfo.update({
            where: {
                userId: userId
            },
            data: {
                ...body
            }
        })

        return updateUserinfo
    }

    async updatePassword(body: UpdatePassword, req: any) {
        const userId = req.user.sub;

        if(body.newPassword !== body.confirmPassword) {
            throw new GoneException({
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

        const verifyPassword = await bcrypt.compare(body.password, getPassword.password)

        if(!verifyPassword) {
            throw new GoneException({
                name: 'password',
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

    async updateTypePreferences(body: UpdateTypePreferences, req: any) {
        const userId = req.user.sub;

        const updateTypePreferences = await this.prisma.userPreferences.update({
            where: {
                userId: userId
            },
            data: {
                ...body,
            }
        })

        return updateTypePreferences
    }

    async updatePrivacySettings(body: UpdatePrivacy, req: any) {
        const userId = req.user.sub;

        const updatePrivacy = await this.prisma.userPreferences.update({
            where: {
                userId: userId
            },
            data: {
                ...body
            }
        })

        return updatePrivacy
    }

    // async update2FA(body: any, req: any) {
    //     const userId = req.user.sub;

    //     const secret = provideSecret()

    //     const update2FA = await this.prisma.user.update({
    //         where: {
    //             id: userId
    //         },
    //         data: {
    //             multiFA: body.twoFactorAuth,
    //             multiFASecret: provideSecret,
    //         }
    //     })

    //     return update2FA
    // }
}
