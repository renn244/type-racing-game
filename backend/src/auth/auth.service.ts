import { BadRequestException, GoneException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import RegisterDto from './dto/Register.dto';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { uuid } from 'uuidv4';
import { AchievementService } from 'src/achievement/achievement.service';
import { EmailSenderService } from 'src/email-sender/email-sender.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly achievementService: AchievementService,
        private readonly emailSender: EmailSenderService
    ) {}

    async register({ username, email, password, confirmPassword }: RegisterDto) {
        try {
            if (password !== confirmPassword) {
                throw new GoneException('passwords do not match');
            }
    
            const hashedPassword = await bcrypt.hash(password, 10);
    
            const user = await this.prisma.user.create({
                data: {
                    username: username,
                    email,
                    password: hashedPassword
                }
            })

            const userInfo = await this.prisma.userinfo.create({
                data: {
                    userId: user.id
                }
            })

            const userBiometrics = await this.prisma.userBiometric.create({
                data: {
                    userId: user.id,
                    AverageAccuracy: 0,
                    AverageWpm: 0,
                }
            })
    
            const userTypePreferences = await this.prisma.userPreferences.create({
                data: {
                    userId: user.id,
                }
            })

            const createPlayerInstance = await this.prisma.player.create({
                data: {
                    userId: user.id,
                    username: user.username,
                    
                }
            })

            await this.achievementService.createUserAllTheAchievements(user.id)

            return user;
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {

                    if (error.meta.target[0] === 'username') {
                        throw new GoneException({
                            name: 'username',
                            message: 'username is already taken'
                        });
                    }
    
                    if (error.meta.target[0] === 'email') {
                        throw new GoneException({
                            name: 'email',
                            message: 'email is already taken'
                        });
                    }
                }
                throw new GoneException('unknown error in the database');
            } else {
                throw new InternalServerErrorException('internal server error');
            }
        }
    }

    async validateLocal(username: string, password: string) {
        const user = await this.prisma.user.findUnique({
            where: {
                username
            },
            include: {
                Player: true
            }
        })

        if (!user) {
            return {
                user: null,
                name: 'username',
                message: 'username does not exist'
            }
        }

        const verifyPassword = await bcrypt.compare(password, user.password);

        if (!verifyPassword) {
            return {
                user: null,
                name: 'password',
                message: 'incorect password'
            }
        }

        return {
            user: user,
            name: null,
            message: "sucessfully loged in"
        }
    }

    async login(user: any) {
        const payload = {
            username: user.username,
            sub: user.id,
            profile: user.profile,
            email: user.email,
            role: user.role,
            createAt: user.createdAt,
            player: user.Player
        }

        const access_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_SECRET,
            expiresIn: '5m'
        })

        const refresh_token = await this.generateRefreshToken(user.id)

        return {
            access_token: access_token,
            refresh_token: refresh_token
        }
    }

    async generateEmailToken(user: User) {
        const token = uuid().replace(/\D/g, '').substring(0, 6);

        // delete all the token regarding this userId because it needs to be unique
        await this.prisma.emailTokens.deleteMany({
            where: {
                userId: user.id
            }
        })

        const createEmailToken = await this.prisma.emailTokens.create({
            data: {
                userId: user.id,
                token: token,
                expiresAt: new Date(Date.now() + 1000 * 60 * 10) // 10 minutes33333
            }
        })

        // send EmailAddress
        await this.emailSender.sendEmail(user.email, '2FA Code', token)

        return {
            redirect: true,
            email: user.email,
            userId: createEmailToken.userId,
            message: "2fa is required"
        }
    }

    async veryfyEmailToken(userId: string, token: string) {

        const getEmailToken = await this.prisma.emailTokens.findFirst({
            where: {    
                userId: userId
            }
        })

        if(!getEmailToken) {
            throw new BadRequestException({
                name: 'user',
                message: 'failed to find the user Token'
            })
        }

        if(getEmailToken.token !== token) {
            throw new BadRequestException({
                name: 'code',
                message: 'code is invalid'
            })
        }

        if(getEmailToken.expiresAt < new Date()) {
            throw new BadRequestException({
                name: 'code',
                message: 'code has expired'
            })
        }

        // successful token verification
        const user = await this.prisma.user.findFirst({
            where: {
                id: getEmailToken.userId
            }
        })

        return this.login(user)
    }

    async checkUser(req: any) {
        const userId = req.user.sub;
        if(userId) {
            const getUser = await this.prisma.user.findFirst({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    username: true,
                    profile: true,
                    email: true,
                    userinfo: true,
                    preferences: true
                },
            })

            if (!getUser) {
                throw new GoneException({
                    name: 'auth',
                    message: 'user not found'
                })
            }
            
            return getUser
        } else {
            throw new GoneException({
                name: 'auth',
                message: 'user not found'
            })
        }
    }

    async generateRefreshToken(userId: string) {
        
        if (!userId) {
            throw new GoneException('userId does not exist')
        }

        const deleteRefreshToken = await this.prisma.refreshtoken.deleteMany({
            where: {
                userId: userId
            }
        })

        const refresh_token = uuid()
        const saveRefreshToken = await this.prisma.refreshtoken.create({
            data: {
                userId: userId,
                token: refresh_token,
                expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14) // 2 weeks
            }
        })

        return saveRefreshToken.token
    }

    async refreshToken(refreshToken: string) {
        
        if (!refreshToken) {
            throw new GoneException({
                name: 'refreshToken',
                message: 'refresh token does not exist'
            })    
        }
        
        const getRefreshToken = await this.prisma.refreshtoken.findFirst({
            where: {
                AND: [
                    {token: refreshToken},
                    {expiresAt: {
                        gt: new Date()
                    }}
                ]
            }
        })

        if (!getRefreshToken) {
            throw new GoneException({
                name: 'refreshToken',
                message: 'refresh token is invalid'
            })
        }

        const user = await this.prisma.user.findFirst({
            where: {
                id: getRefreshToken.userId
            },
            include: {
                Player: true
            }
        })

        return this.login(user)
    }
}
