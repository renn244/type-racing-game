import { Test, TestingModule } from '@nestjs/testing';
import { GlobalAchievementService } from './global-achievement.service';
import { PrismaService } from '../prisma/prisma.service';
import { AchievementService } from '../achievement/achievement.service';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateGlobalAchievementDto } from './dto/createAchievement.dto';
import { Prisma } from '@prisma/client';

describe('GlobalAchievementService', () => {
  let service: GlobalAchievementService;
  let achievementService: AchievementService;
  let prisma: PrismaService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GlobalAchievementService,
        AchievementService,
        {
          provide: PrismaService,
          useValue: {
            globalAchievements: {
              findMany: jest.fn(),
              count: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
            }
          }
        }
      ],
    }).compile();

    service = module.get<GlobalAchievementService>(GlobalAchievementService);
    prisma = module.get<PrismaService>(PrismaService);
    achievementService = module.get<AchievementService>(AchievementService);
  });

  // i skipped the autoCorrect method because it's just a simple query

  describe('getGlobalAchievements', () => {
    const mockGlobalAchievements = [
      {
        id: "achv-001", name: "First Steps", description: "Complete your first task to get started.", goal: 1,
        taskType: "Milestone", occurrence: 1, category: "Beginner"
      },
      {
          id: "achv-002", name: "Daily Grinder", description: "Complete tasks every day for a week.", goal: 7,
          taskType: "Daily", occurrence: 7, category: "Intermediate"
      },
    ] as any
    
    it('should return achievements and hasNext as true',  async () => {
      const query = { page: "1", search: "First" }

      jest.spyOn(prisma.globalAchievements, 'findMany').mockResolvedValue(mockGlobalAchievements);
      jest.spyOn(prisma.globalAchievements, 'count').mockResolvedValue(15);

      const result = await service.getGlobalAchievements(query);

      expect(result).toEqual({
        achievements: mockGlobalAchievements,
        hasNext: true
      })
      expect(prisma.globalAchievements.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        take: 10,
        skip: 0
      })
    })

    it('should return achievements and hasNext as false',  async () => {
      const query = { page: "2", search: "First" }

      jest.spyOn(prisma.globalAchievements, 'findMany').mockResolvedValue(mockGlobalAchievements);
      jest.spyOn(prisma.globalAchievements, 'count').mockResolvedValue(15);

      const result = await service.getGlobalAchievements(query);

      expect(result).toEqual({
        achievements: mockGlobalAchievements,
        hasNext: false
      })
      expect(prisma.globalAchievements.findMany).toHaveBeenCalledWith({
        where: {
          name: {
            contains: query.search,
            mode: 'insensitive'
          }
        },
        take: 10,
        skip: 10
      })
    })
  })

  describe('getGlobalAchievementById', () => {
    const mockGlobalAchievement = {
      id: "achv-001", name: "First Steps", description: "Complete your first task to get started.", goal: 1,
      taskType: "Milestone", occurrence: 1, category: "Beginner"
    } as any

    it('should return globalAchievement if it finds one', async () => {
      jest.spyOn(prisma.globalAchievements, 'findUnique').mockResolvedValue(mockGlobalAchievement)

      const result = await service.getGlobalAchievementById("mockId");
      expect(result).toEqual(mockGlobalAchievement)
    })

    it('should throw an notFound Exception if it fails to find the GlobalAchievement or undefined', async () => {
      jest.spyOn(prisma.globalAchievements, 'findUnique').mockResolvedValue(undefined);

      await expect(service.getGlobalAchievementById("mockId")).rejects.toThrow(new NotFoundException({
        name: 'achievement',
        message: "Achievement not found"
      }))
    }) 
  })

  describe('createGlobalAchievement', () => {
    const mockBody: CreateGlobalAchievementDto = {
      name: "mockBody", description: "this is just a mock", goal: 23, 
      occurrence: 100, taskType: "Process", category: "Accuracy"
    }

    it('it should create globalAchievement and return it and also call addUserAchievement with proper id', async () => {
      const prismaMock = {
        ...mockBody, id: 'example mock' 
      } as any
      
      achievementService.addUserAchievement = jest.fn();
      (achievementService.addUserAchievement as jest.Mock).mockResolvedValue("example" as any);
      jest.spyOn(prisma.globalAchievements, 'create').mockResolvedValue(prismaMock);

      const result = await service.createGlobalAchievement(mockBody)

      expect(result).toEqual(prismaMock)
      expect(achievementService.addUserAchievement).toHaveBeenCalledWith("example mock")
    })

    it('it should throw a BadRequestException if the taskType is Process and there is no occurence value', async () => {
      const modifiedMockBody = {
        ...mockBody,
        occurrence: undefined
      }


      await expect(service.createGlobalAchievement(modifiedMockBody)).rejects.toThrow( new BadRequestException({
        name: 'occurrence',
        message: 'Occurrence is required for Process type'
      }))
    })
  })

  describe('deleteGlobalAchievement', () => { 
    const PrismaErrorMock = new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`title`)',{
      code: 'P2025',
      meta: { target: ['title'] },
      clientVersion: '2.19.0',
      batchRequestIdx: 0,
    })
    
    const mockBody: CreateGlobalAchievementDto = {
      name: "mockBody", description: "this is just a mock", goal: 23, 
      occurrence: 100, taskType: "Process", category: "Accuracy"
    }

    it("should delete a globalAchievement and return it's value", async () => {
      
      jest.spyOn(prisma.globalAchievements, 'delete').mockResolvedValue(mockBody as any)

      const result = await service.deleteGlobalAchievement('randomId')
      expect(result).toEqual(mockBody)
    })

    it('should throw notFound Exception when failed to find the id the is giver', async () => {
      
      jest.spyOn(prisma.globalAchievements, 'delete').mockRejectedValue(PrismaErrorMock)

      await expect(service.deleteGlobalAchievement('randomId')).rejects.toThrow(new NotFoundException({
        name: "achievement", message: "Achievement not found"
      }))
    })

  })

  describe('updateGlobalAchievement', () => {
    const mockBody = {
      name: "mockBody", description: "this is just a mock", goal: 23, 
      occurrence: 100, taskType: "Process", category: "Accuracy"
    } as any
    
    it('should update the globalAchievement base on id', async () => {
      jest.spyOn(prisma.globalAchievements, 'update').mockResolvedValue(mockBody as any)

      const result = await service.updateGlobalAchievement("mockId", mockBody)
      expect(result).toEqual(mockBody)
    })

    it('should throw a BadRequestException if taskType is Process but the occurence is falsy(not defined)', async () => {
      const modifiedMockBody = {
        ...mockBody,
        occurrence: undefined
      } as any

      await expect(service.updateGlobalAchievement("exampleId", modifiedMockBody)).rejects.toThrow(new BadRequestException({
        name: 'occurrence', message: 'Occurrence is required for Process type'
      }))
    })

    it("should throw a NotFoundException if the id does not exist", async () => {
      jest.spyOn(prisma.globalAchievements, 'update').mockRejectedValue(new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`title`)',{
        code: 'P2025',
        meta: { target: ['id'] },
        clientVersion: '2.19.0',
        batchRequestIdx: 0,
      }))

      await expect(service.updateGlobalAchievement('exampleId', mockBody)).rejects.toThrow(new NotFoundException({
        name: "achievement", message: "Achievement not found"
      }))
    })
  })
});
