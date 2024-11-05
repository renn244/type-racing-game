import { BadRequestException, GoneException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGlobalAchievementDto } from './dto/createAchievement.dto';

@Injectable()
export class GlobalAchievementService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async autoCorrect(body: { search: string}) {
        const achievements = await this.prisma.globalAchievements.findMany({
            where: {
                name: {
                    contains: body.search,
                    mode: 'insensitive'
                }
            },
            select: {
                name: true
            },
            take: 10
        });

        return achievements;
    }

    // add paginations later
    async getGlobalAchievements(query: { page: string, search: string }) {
        const page = parseInt(query.page) || 1;
        const limit = 10;
        const skip = (page - 1) * limit;
        
        const achievements = await this.prisma.globalAchievements.findMany({
            where: {
                name: {
                    contains: query.search,
                    mode: 'insensitive'
                }
            },
            take: limit,
            skip: skip
        });
        
        const totalAchievements = await this.prisma.globalAchievements.count()
        const hasNext = totalAchievements > (page * limit);

        return {
            achievements,
            hasNext
        }
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
        if(body.taskType === 'Process' && !body.occurrence) {
            throw new BadRequestException({
                name: 'occurrence',
                message: 'Occurrence is required for Process type'
            })
        }

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
            if(body.taskType === 'Process' && !body.occurrence) {
                throw new BadRequestException({
                    name: 'occurrence',
                    message: 'Occurrence is required for Process type'
                })
            }

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
}
