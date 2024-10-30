import { GoneException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/CreateChallenge.dto';
import { Prisma } from '@prisma/client';
import { ChallengeResultDto } from './dto/ChallengeResult.dto';

@Injectable()
export class ChallengeService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async autoCorrect(body: { search: string }) {
        const search = await this.prisma.challenge.findMany({
            where: {
                title: {
                    contains: body.search,
                    mode: 'insensitive'
                }
            },
            select: {
                title: true,
            },
            take: 10
        })

        return search
    }

    // parameters of request? body for filter or selection? and pagination?
    async getChallenges(query: { page: string, search: string }) {
        const page = parseInt(query.page)
        const limit = 10
        const skip = (page - 1) * limit
        
        const challenges = await this.prisma.challenge.findMany({
            where: {
                title: {
                    contains: query.search,
                    mode: 'insensitive'
                }
            },
            take: limit,
            skip: skip,
        })

        const totalChallenges = await this.prisma.challenge.count()
        const hasNext = totalChallenges  > (page * limit)
  
        return {
            challenges,
            hasNext
        }
    }

    async getChallenge(challengeId: string) {
        const challenge = await this.prisma.challenge.findUnique({
            where: {
                id: challengeId
            }
        })

        if(!challenge) {
            throw new NotFoundException({
                name: 'challenge',
                message: 'challenge not found'
            })
        }
        
        return challenge
    }

    async createChallengeResut(body: ChallengeResultDto, req: any) {
        try {
            const userId = req.user.sub
            console.log(userId)
            // should handle if he retry agai nbecause this will throw an error so make sure to delete it first

            const CreateChallengeResult = await this.prisma.challengeCompleted.create({
                data: {
                    userId: userId,
                    challengeId: body.challengeId,
                    typed: body.typed,
                    wpm: body.wpm,
                    accuracy: body.accuracy,
                    time: body.time,
                    
                }
            })

            return CreateChallengeResult
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    // i don't know if this will be used kase i hahandle din naman kung nag eexist na
                    if (error.meta.target[0]) {
                        throw new GoneException({
                            name: error.meta.target[0],
                            message: 'you have already submitted on this challenge'
                        })
                    }
                }
                console.log(error)
                throw new GoneException('unknown error in the database')
            } else {
                throw new InternalServerErrorException('internal server error')
            }
        }
    }

    // should this be only accessible by admin?
    async createChallenge({ title, description, challenge, difficulty } : CreateChallengeDto, req: any) { 
        try {
            const createChallengePrisma = await this.prisma.challenge.create({
                data: {
                    title,
                    description,
                    difficulty,
                    challenge,
                }
            })

            return createChallengePrisma
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {

                    if (error.meta.target[0]) {
                        throw new GoneException({
                            name: error.meta.target[0],
                            message: `${error.meta.target[0]} is already taken`
                        })
                    }
                    
                    throw new GoneException('unknown error in the database')
                }
            } 

            throw new InternalServerErrorException('internal server error')
        }
    }


    async patchChallenge({ title, description, challenge, difficulty } : CreateChallengeDto, challengeId: string) {
        try {
            const updateChallenge = await this.prisma.challenge.update({
                where: {
                    id: challengeId
                },
                data: {
                    title,
                    description,
                    difficulty,
                    challenge
                }
            })
    
            return updateChallenge
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {

                    if (error.meta.target[0]) {
                        throw new GoneException({
                            name: error.meta.target[0],
                            message: `${error.meta.target[0]} is already taken`
                        })
                    }
                    
                    throw new GoneException('unknown error in the database')
                }

                if (error.code === 'P2025') {
                    throw new NotFoundException({
                        name: 'challenge',
                        message: 'challenge not found'
                    })
                }
                
                throw new GoneException('unknown error in the database')
            }
            throw new InternalServerErrorException('internal server error')
        }
    }

    async deleteChallenge(challengeId: string) {
        try {
            const deleteChallenge = await this.prisma.challenge.delete({
                where: {
                    id: challengeId
                }
            })
    
            return deleteChallenge
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException({
                        name: 'challenge',
                        message: 'challenge not found'
                    })
                }
                throw new GoneException('unknown error in the database')
            } 

            throw new InternalServerErrorException('internal server error')
            
        }
    }

    async getFinishChallenges(userId: string) {
        const finishedChallenges = await this.prisma.user.findMany({
            where: {
                id: userId
            },
            include: {
                completedChallenges: {
                    include: {
                        challenge: true
                    }
                }
            }
        })

        return finishedChallenges
    }
}
