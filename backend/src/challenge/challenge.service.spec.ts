import { Test, TestingModule } from '@nestjs/testing';
import { ChallengeService } from './challenge.service';
import { PrismaService } from '../prisma/prisma.service';
import { ChallengeCategory, Difficulty, Prisma } from '@prisma/client';
import { contains } from 'class-validator';
import { GoneException, NotFoundException } from '@nestjs/common';
import { ChallengeResultDto } from './dto/ChallengeResult.dto';

describe('ChallengeService', () => {
  let service: ChallengeService;
  let prisma: PrismaService;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChallengeService,
        {
          provide: PrismaService,
          useValue: {
            challenge: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              count: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            },
            userinfo: {
              findMany: jest.fn(),
            },
            challengeCompleted: {
              create: jest.fn(),
              findUnique: jest.fn(),
              delete: jest.fn()
            }
          }
        }
      ],
    }).compile();

    service = module.get<ChallengeService>(ChallengeService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('autoCorrect', () => { // this is not really not important because it just calling the database
    it('should return what is search', async () => {
      const search = 'test 1'
      const mockResult = [{ title: 'test 1' }, { title: 'test 11' }];
      prisma.challenge.findMany = jest.fn().mockResolvedValue(mockResult);

      const result = await service.autoCorrect({ search});
      expect(result).toEqual(mockResult)
    })
  })

  describe('getChallenges', () => {
    const mockChallenges = [
      { id: '2', title: 'Challenge 1', description: 'Description 1', challenge: 'Solve problem 1', difficulty: 'EASY' as Difficulty,
         userComplete: [], category: 'Daily' as ChallengeCategory, createdAt: new Date(), updatedAt: new Date() },
      { id: '3', title: 'Challenge 2', description: 'Description 2', challenge: 'Solve problem 2', difficulty: 'MEDIUM' as Difficulty,
         userComplete: [], category: 'Daily' as ChallengeCategory, createdAt: new Date(), updatedAt: new Date() }
    ];

    it('should return paginated challenges and hasNext as true if there are more challenge when count', async () => {
      const query = { page: '1', search: 'Challenge' };

      jest.spyOn(prisma.challenge, 'findMany').mockResolvedValue(mockChallenges);
      jest.spyOn(prisma.challenge, 'count').mockResolvedValue(30); // this guaranteed that hasNext is true

      const result = await service.getChallenges(query);
      expect(result.challenges).toEqual(mockChallenges);
      expect(result.hasNext).toBe(true);

    })

    it('should return paginated challenges and hasNext as false if there are no more challenge when count', async () => {
      const query = { page: '1', search: 'Challenge' };

      jest.spyOn(prisma.challenge, 'findMany').mockResolvedValue(mockChallenges);
      jest.spyOn(prisma.challenge, 'count').mockResolvedValue(4); // this guaranteed that hasNext is false

      const result = await service.getChallenges(query);
      expect(result.challenges).toEqual(mockChallenges);
      expect(result.hasNext).toBe(false);
    })

    it('should return proper pagination numbers and has Next should be false', async () => {
      const query = { page: '2', search: 'Challenge' };
      
      jest.spyOn(prisma.challenge, 'findMany').mockResolvedValue(mockChallenges);
      jest.spyOn(prisma.challenge, 'count').mockResolvedValue(20); 

      const result = await service.getChallenges(query);

      expect(prisma.challenge.findMany).toHaveBeenCalledWith({
        where: {
          title: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        take: 10,
        skip: 10,
      })

      expect(result.challenges).toEqual(mockChallenges);
      expect(result.hasNext).toBe(false);
    })
  })

  describe('getChallenge', () => {
    it('should return a challenge if it exists', async () => {
      const mockChallenge = { id: '2', title: 'Challenge 1', description: 'Description 1', challenge: 'Solve problem 1', difficulty: 'EASY' as Difficulty,
         userComplete: [], category: 'Daily' as ChallengeCategory, createdAt: new Date(), updatedAt: new Date() };
      
      jest.spyOn(prisma.challenge, 'findUnique').mockResolvedValue(mockChallenge);

      const result = await service.getChallenge('2');
      expect(result).toEqual(mockChallenge);
    })

    it('should throw an error if challenge does not exist', async () => {
      jest.spyOn(prisma.challenge, 'findUnique').mockResolvedValue(null);

      await expect(service.getChallenge('2')).rejects.toThrow( new NotFoundException({
        name: 'challenge',
        message: 'challenge not found'
      }));
    })
  })

  describe('creatChallenge Result', () => {
    const req = { user: { sub: 'hdasine' } }
    const mockChallengeResultData: ChallengeResultDto = {
      challengeId: 'test3',
      typed: 'hello world',
      accuracy: 100,
      wpm: 47,
      time: 60
    } 
    
    it('should create a challenge Result', async () => {
      const challengeResultResponse = {
        ...mockChallengeResultData,
        userId: req.user.sub,
        id: 'sdadkniuwq',
        dateCompleted: new Date()
      }

      jest.spyOn(prisma.challengeCompleted, 'findUnique').mockResolvedValue(undefined)
      jest.spyOn(prisma.challengeCompleted, 'create').mockResolvedValue(challengeResultResponse)

      const result = await service.createChallengeResult(mockChallengeResultData, req)
      expect(result).toEqual(challengeResultResponse)
      expect(prisma.challengeCompleted.delete).not.toHaveBeenCalled()
      expect(prisma.challengeCompleted.create).toHaveBeenCalledWith({
        data: {
          ...mockChallengeResultData,
          userId: req.user.sub
      }})
    })

    it('should delete the previous data and create another one', async () => {
      const newlyCreatedResult = {
        ...mockChallengeResultData,
        userId: req.user.sub,
        id: 'this is the new one',
        dateCompleted: new Date()
      }
      const challengeResultResponse = {
        ...mockChallengeResultData,
        userId: req.user.sub,
        id: 'sdadkniuwq',
        dateCompleted: new Date()
      }

      jest.spyOn(prisma.challengeCompleted, 'findUnique').mockResolvedValue(challengeResultResponse)
      jest.spyOn(prisma.challengeCompleted, 'delete').mockResolvedValue(challengeResultResponse)
      jest.spyOn(prisma.challengeCompleted, 'create').mockResolvedValue(newlyCreatedResult)

      const result = await service.createChallengeResult(mockChallengeResultData, req)

      expect(result).toEqual(newlyCreatedResult)
      expect(prisma.challengeCompleted.delete).toHaveBeenCalled() // making sure that dlete is called
    })
  })

  describe('createChallenge', () => {
    const mockExpectedChallenge = { id: '2', title: 'Challenge 1', description: 'Description 1', challenge: 'Solve problem 1', difficulty: 'EASY' as Difficulty,
      userComplete: [], category: 'Daily' as ChallengeCategory, createdAt: new Date(), updatedAt: new Date() };
    const mockChallenge = { title: 'Challenge 1', description: 'Description 1', challenge: 'Solve problem 1', difficulty: 'EASY' as Difficulty,  category: 'Daily' as ChallengeCategory, };
    it('should create a challenge and return the created challenge', async () => {
      
      jest.spyOn(prisma.challenge, 'create').mockResolvedValue(mockExpectedChallenge);

      const result = await service.createChallenge(mockChallenge, {});
      expect(result).toEqual(mockExpectedChallenge);
    })

    it('should throw an error for title if already taken (unique constraint error)', async () => {
      const PrismaErrorMock = new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`title`)',{
        code: 'P2002',
        meta: { target: ['title'] },
        clientVersion: '2.19.0',
        batchRequestIdx: 0,
      })
        
      
      jest.spyOn(prisma.challenge, 'create').mockRejectedValue(PrismaErrorMock);

      await expect(service.createChallenge(mockChallenge, {})).rejects.toThrow(new GoneException({
        title: 'title',
        message: 'title is already taken'
      }));
    })

    it('should throw an error if challenge already taken (unique constraint error)', async () => {
      const PrismaErrorMock = new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`title`)',{
        code: 'P2002',
        meta: { target: ['challenge'] },
        clientVersion: '2.19.0',
        batchRequestIdx: 0,
      })

      jest.spyOn(prisma.challenge, 'create').mockRejectedValue(PrismaErrorMock);

      await expect(service.createChallenge(mockChallenge, {})).rejects.toThrow(new GoneException({
        title: 'challenge',
        message: 'challenge is already taken'
      }));
    })
  })



  describe('patchChallenge', () => {
    const mockChallenge = { title: 'Challenge 1', description: 'Description 1', challenge: 'Solve problem 1', difficulty: 'EASY' as Difficulty,  category: 'Daily' as ChallengeCategory, };
    const mockExpectedChallenge = { id: '2', title: 'Challenge 1', description: 'Description 1', challenge: 'Solve problem 1', difficulty: 'EASY' as Difficulty,  category: 'Daily' as ChallengeCategory,
      userComplete: [], createdAt: new Date(), updatedAt: new Date() };

    it('should update a challenge and return the updated challenge', async () => {
      jest.spyOn(prisma.challenge, 'update').mockResolvedValue(mockExpectedChallenge);

      const result = await service.patchChallenge(mockChallenge, '2');
      expect(result).toEqual(mockExpectedChallenge);
    })

    it('should throw an error if challenge does not exist', async () => {
      const PrimsaErrorMock = new Prisma.PrismaClientKnownRequestError('An operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.', {
        code: 'P2025',
        meta: { target: ['id'] },
        clientVersion: '2.19.0',
        batchRequestIdx: 0,
      })

      jest.spyOn(prisma.challenge, 'update').mockRejectedValue(PrimsaErrorMock);

      await expect(service.patchChallenge(mockChallenge, '2')).rejects.toThrow(new NotFoundException({
        name: 'challenge',
        message: 'challenge not found'
      }));
    })

    it('should throw an error for title if already taken (unique constraint error)', async () => {
      const PrismaErrorMock = new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`title`)',{
        code: 'P2002',
        meta: { target: ['title'] },
        clientVersion: '2.19.0',
        batchRequestIdx: 0,
      })
        
      
      jest.spyOn(prisma.challenge, 'update').mockRejectedValue(PrismaErrorMock);

      await expect(service.patchChallenge(mockChallenge, '2')).rejects.toThrow(new GoneException({
        title: 'title',
        message: 'title is already taken'
      }));
    })

    
    it('should throw an error if challenge already taken (unique constraint error)', async () => {
      const PrismaErrorMock = new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`title`)',{
        code: 'P2002',
        meta: { target: ['challenge'] },
        clientVersion: '2.19.0',
        batchRequestIdx: 0,
      })

      jest.spyOn(prisma.challenge, 'update').mockRejectedValue(PrismaErrorMock);

      await expect(service.patchChallenge(mockChallenge, '2')).rejects.toThrow(new GoneException({
        title: 'challenge',
        message: 'challenge is already taken'
      }));
    })
  })

  describe('deleteChallenge', () => {
    const mockExpectedChallenge = { id: '2', title: 'Challenge 1', description: 'Description 1', challenge: 'Solve problem 1', difficulty: 'EASY' as Difficulty,
      userComplete: [], category: 'Daily' as ChallengeCategory, createdAt: new Date(), updatedAt: new Date() };
    
    it('should delete a challenge', async () => {
      jest.spyOn(prisma.challenge, 'delete').mockResolvedValue(mockExpectedChallenge);

      const result = await service.deleteChallenge('2');
      expect(result).toEqual(mockExpectedChallenge);
    })

    it('should throw an error if challenge does not exist', async () => {
      const PrimsaErrorMock = new Prisma.PrismaClientKnownRequestError('An operation failed because it depends on one or more records that were required but not found. Record to delete does not exist.', {
        code: 'P2025',
        meta: { target: ['id'] },
        clientVersion: '2.19.0',
        batchRequestIdx: 0,
      })

      jest.spyOn(prisma.challenge, 'delete').mockRejectedValue(PrimsaErrorMock);

      await expect(service.deleteChallenge('2')).rejects.toThrow(new NotFoundException({
        name: 'challenge',
        message: 'challenge not found'
      }));
    })
  })

  // don't test the get Finish as it is jsut a database call
});
