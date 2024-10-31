import { GoneException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateChallengeDto } from './dto/CreateChallenge.dto';
import { ChallengeCategory, Prisma } from '@prisma/client';
import { ChallengeResultDto } from './dto/ChallengeResult.dto';

@Injectable()
export class ChallengeService {
    DailyChallengeId = 'cm2x7yyn6000522b1w7vznwux' // this will be changed through cronjobs
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

    async getDailyChallenge() {
        const getDailychallenge = await this.prisma.challenge.findFirst({
            where: {
                id: this.DailyChallengeId
            }
        })

        return getDailychallenge
    }

    async getChallengesForUser(query: {search: string, category: ChallengeCategory}) {
        let catogoryQuery = {}
        if (query.category) {
            catogoryQuery = {
                category: query.category
            }
        }

        const challenges = await this.prisma.challenge.findMany({
            where: {
                title: {
                    contains: query.search,
                    mode: 'insensitive',
                },
                ...catogoryQuery
            },
            take: 30
        })

        const organizedChallenges = {
            featured: [],
            daily: [],
            practice: []
        }

        challenges.forEach(challenge => {
            const category = challenge.category.toLowerCase();
            
            if(organizedChallenges[category]) {
                organizedChallenges[category].push(challenge)
            }
        })

        return organizedChallenges
    }

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

    async createChallengeResult(body: ChallengeResultDto, req: any) {
        try {
            const userId = req.user.sub

            const findChallengeExist = await this.prisma.challengeCompleted.findUnique({
                where: {
                    challengeId_userId: {
                        userId: userId,
                        challengeId: body.challengeId
                    }
                }
            })

            if (findChallengeExist) {
                const deleteChallenge = await this.prisma.challengeCompleted.delete({
                    where: {
                        challengeId_userId: {
                            userId: userId,
                            challengeId: body.challengeId
                        }
                    }
                })
            }

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

            const updateBiometrics = this.UpdateUserBiometrics(userId)

            return CreateChallengeResult
        } catch (error) {
            if(error instanceof Prisma.PrismaClientKnownRequestError) {
                if(error.code === 'P2002') {
                    if (error.meta.target[0]) {
                        throw new GoneException({
                            name: error.meta.target[0],
                            message: 'you have already submitted on this challenge'
                        })
                    }
                }
                throw new GoneException('unknown error in the database')
            } else {
                throw new InternalServerErrorException('internal server error')
            }
        }
    }

    // should this be only accessible by admin?
    async createChallenge({ title, description, challenge, difficulty,category } : CreateChallengeDto, req: any) { 
        try {
            const createChallengePrisma = await this.prisma.challenge.create({
                data: {
                    title,
                    description,
                    difficulty,
                    challenge,
                    category
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


    async patchChallenge({ title, description, challenge, difficulty, category } : CreateChallengeDto, challengeId: string) {
        try {
            const updateChallenge = await this.prisma.challenge.update({
                where: {
                    id: challengeId
                },
                data: {
                    title,
                    description,
                    difficulty,
                    challenge,
                    category
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

    async UpdateUserBiometrics(userId: string) {
        const getAllChallengesCompleted = await this.prisma.challengeCompleted.findMany({
            where: {
                userId: userId
            }
        })

        let NumberofCompletedChallenges = getAllChallengesCompleted.length
        let accuracy = 0
        let wpm = 0
        let timePracticed = 0

        await getAllChallengesCompleted.forEach((completedChallenge) => {
            accuracy += completedChallenge.accuracy
            wpm += completedChallenge.wpm
            timePracticed += completedChallenge.time
        })

        let averageAccuracy = accuracy / NumberofCompletedChallenges
        let averageWpm = wpm / NumberofCompletedChallenges
        
        const hours = Math.floor(timePracticed / 3600)
        const minutes = Math.floor((timePracticed % 3600) / 60)
        const seconds = timePracticed % 60
        const time = `${hours}h ${minutes}m ${seconds}s`

        const saveBiometrics = await this.prisma.userBiometric.update({
            where: {
                userId: userId
            },
            data: {
                TimePracticed: time,
                AverageAccuracy: averageAccuracy,
                AverageWpm: averageWpm
            }
        })

        return saveBiometrics
   }
}