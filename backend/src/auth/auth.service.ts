import { GoneException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import RegisterDto from './dto/Register.dto';
import * as bcrypt from 'bcrypt';
import { Prisma, User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService
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

    async login(user: User) {
        const payload = {
            username: user.username,
            sub: user.id,
            profile: user.profile,
            email: user.email,
            createAt: user.createdAt
        }

        return {
            access_token: this.jwtService.sign(payload, {
                secret: process.env.JWT_SECRET,
                expiresIn: '5m'
            })
        }
    }

    async checkUser(req: any) {
        const userId = req.user.sub;

        if(!userId) {
            const getUser = await this.prisma.user.findFirst({
                where: {
                    id: userId
                },
                select: {
                    id: true,
                    username: true,
                    profile: true,
                    email: true,
                    userinfo: true
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
}
