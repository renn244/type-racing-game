import { Test, TestingModule } from '@nestjs/testing';
import { AchievementService } from './achievement.service';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { progress } from 'framer-motion';

describe('AchievementService', () => {
  let service: AchievementService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AchievementService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findFirst: jest.fn()
            },
            globalAchievements: {
              findMany: jest.fn()
            },
            userAchievement: {
              create: jest.fn(),
              update: jest.fn()
            }
          }
        }
      ],
    }).compile();

    service = module.get<AchievementService>(AchievementService);
    prisma = module.get<PrismaService>(PrismaService)
  });

  const mockAchievementData = {
    achievement: {
      name: "Test Achievement",
      id: "achievement-001",
      description: "Complete the challenge to earn this achievement",
      goal: 80,
      taskType: "Milestone",  // or TaskType.Process, depending on the test scenario
      occurrence: 100,               // or a value related to the taskType
      category: "WPM", // or AchievementCategory.Accuracy, etc.
    },
    id: "userAchievement-001",
    userId: "mockUserId",
    achievementId: "achievement-001",
    isFinished: false,
    progress: 50,
    dateFinished: new Date("2024-11-09"), // or null/undefined if not finished
  };

  describe("addUserAchievement", () => {
    const mockUsers = [
      {
          id: "user-001",
          username: "johndoe",
          profile: "https://example.com/profiles/johndoe.jpg",
          email: "johndoe@example.com"
      },
      {
          id: "user-002",
          username: "janedoe",
          profile: "https://example.com/profiles/janedoe.jpg",
          email: "janedoe@example.com"
      },
      {
          id: "user-003",
          username: "alexsmith",
          profile: "https://example.com/profiles/alexsmith.jpg",
          email: "alexsmith@example.com"
      }
    ] as any
    it("should find all Users and create them achievements each One", async () => {
      const mockAchievementId = "mockId" 

      jest.spyOn(prisma.user, 'findMany').mockResolvedValue(mockUsers)

      const createUserAchievementMock = jest.spyOn(service, 'createUserAchievement')
      .mockResolvedValue("mockAchievement" as any);

      const result = await service.addUserAchievement(mockAchievementId)
    
      expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
      expect(createUserAchievementMock).toHaveBeenCalledTimes(3);

      mockUsers.forEach(user => {
        expect(createUserAchievementMock).toHaveBeenCalledWith(user.id, mockAchievementId);
      })
    })
  })
  
  describe("createUserAchievement", () => {
    const mockUserId = "mockUserId"
    const mockAchievementId = "mockAchievementId"

    it('should create a user and return it', async () => {
      const mockPrismaUserAchievement = {
        id: 'mockId', userId: mockUserId, achievementId: mockAchievementId, isFinish: false, progress: 50
      } as any

      jest.spyOn(prisma.userAchievement, 'create').mockResolvedValue(mockPrismaUserAchievement)

      const result = await service.createUserAchievement(mockUserId, mockAchievementId);
      expect(result).toEqual(mockPrismaUserAchievement)
    })

    it('should throw an BadRequestException if the user already exist', async () => {
      jest.spyOn(prisma.userAchievement, 'create').mockRejectedValue(new Prisma.PrismaClientKnownRequestError('Unique constraint failed on the fields: (`title`)',{
        code: 'P2002',
        meta: { target: ['userId', 'achievementId'] },
        clientVersion: '2.19.0',
        batchRequestIdx: 0,
      }))

      const result = await service.createUserAchievement(mockUserId, mockAchievementId)
      expect(result).toEqual(new BadRequestException({
        name: ['userId', 'achievementId'], message: "achievement already Exist on this user"
      }))
    })
  })


  describe('createUserAllTheAchievements', () => {
    it('should create userAchivement for all users', async () => {
      const mockGlobalAchievementPrisma = [
        { id: "mockId1"}, { id: "mockId2"}, { id: "mockId3"}, { id: "mockId4"}
      ] as any

      jest.spyOn(prisma.globalAchievements, 'findMany').mockResolvedValue(mockGlobalAchievementPrisma)

      const createUserAchievementMock = jest.spyOn(service, 'createUserAchievement')
      .mockResolvedValue("mock Achievement" as any)

      const result = await service.createUserAllTheAchievements("mockUserId")

      expect(prisma.globalAchievements.findMany).toHaveBeenCalledTimes(1);
      expect(createUserAchievementMock).toHaveBeenCalledTimes(4);

      mockGlobalAchievementPrisma.map(globalAchievement => {
        expect(createUserAchievementMock).toHaveBeenCalledWith("mockUserId", globalAchievement.id)
      })
    })
  })

  describe('recalculateUserAchievements', () => {
    const mockUserId = "mockUserId";
    
    it('should throw NotFoundException if user does not exist', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(null);
  
      await expect(service.recalculateUserAchievements(mockUserId)).rejects.toThrow(NotFoundException);
      expect(prisma.user.findFirst).toHaveBeenCalledWith({
        where: { id: mockUserId },
        select: expect.anything(),
      });
    });
  
    it('should return if user has no achievements', async () => {
      const mockUserInfo = { Achievements: [], completedChallenges: [], Biometrics: {} } as any;
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUserInfo);
  
      const result = await service.recalculateUserAchievements(mockUserId);
      expect(result).toBeUndefined();
    });
  
    it('should skip updating if achievements are already completed', async () => {
      const mockUserInfo = {
        Achievements: [{ isFinished: true, achievement: { taskType: 'Milestone' } }],
        completedChallenges: [],
        Biometrics: {},
      } as any;
  
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUserInfo);
      const recalculateMilestoneAchievementSpy = jest.spyOn(service, 'recalculateMilestoneAchievement');
  
      const result = await service.recalculateUserAchievements(mockUserId);
      expect(recalculateMilestoneAchievementSpy).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  
    it('should call recalculateMilestoneAchievement for milestone achievements', async () => {
      const mockUserInfo = {
        Achievements: [
          { id: "achievementId1", isFinished: false, achievement: { taskType: 'Milestone' } },
        ],
        completedChallenges: [],
        Biometrics: {},
      } as any;
  
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUserInfo);
      const recalculateMilestoneAchievementSpy = jest.spyOn(service, 'recalculateMilestoneAchievement')
        .mockResolvedValue(undefined);
  
      await service.recalculateUserAchievements(mockUserId);
  
      expect(recalculateMilestoneAchievementSpy).toHaveBeenCalledWith(
        mockUserInfo.Achievements[0],
        mockUserInfo
      );
    });
  
    it('should call recalculateProcessAchievement for process achievements', async () => {
      const mockUserInfo = {
        Achievements: [
          { id: "achievementId2", isFinished: false, achievement: { taskType: 'Process' } },
        ],
        completedChallenges: [],
        Biometrics: {},
      } as any;
  
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUserInfo);
      const recalculateProcessAchievementSpy = jest.spyOn(service, 'recalculateProcessAchievement')
        .mockResolvedValue(undefined);
  
      await service.recalculateUserAchievements(mockUserId);
  
      expect(recalculateProcessAchievementSpy).toHaveBeenCalledWith(
        mockUserInfo.Achievements[0],
        mockUserInfo
      );
    });
  });

  describe('updateProgress', () => {
    const mockReturnType = {
      id: "mockId",
      userId: "mockUserId",
      achievementId: "mockAchievementId",
      isFinished: false,
      progress: 50,
      dateFinised: null
    }

    it('it should make the isFinished false when the are less than or not equal newProgress and achievementBasis(Process)', async () => {
      jest.spyOn(prisma.userAchievement, 'update').mockResolvedValue(mockReturnType as any)

      await service.updateProgress(mockAchievementData, 60, 'Process')

      expect(prisma.userAchievement.update).toHaveBeenCalledWith({
        where: { id: mockAchievementData.id }, 
        data: { isFinished: false, progress: 60 }
      })
    })

    it('it should make the isFinished true when the are more than or equal newProgress and achievementBasis (Process)', async () => {
      jest.spyOn(prisma.userAchievement, 'update').mockResolvedValue(mockReturnType as any)

      await service.updateProgress(mockAchievementData, 100, 'Process')

      expect(prisma.userAchievement.update).toHaveBeenCalledWith({
        where: { id: mockAchievementData.id },
        data: { isFinished: true, progress: mockAchievementData.achievement.occurrence }
      })
    })

    it('it should make the isFinished false when the are less than or not equal new Progress and achievementBasis (Milestone)', async () => {
      const modifiedMock = {
        ...mockAchievementData,
        achievement: { ...mockAchievementData.achievement, taskType: 'Milestone', occurrence: undefined },
      }
      jest.spyOn(prisma.userAchievement, 'update').mockResolvedValue(mockReturnType as any)

      await service.updateProgress(modifiedMock, 60, 'Milestone')
      
      expect(prisma.userAchievement.update).toHaveBeenCalledWith({
        where: { id: mockAchievementData.id },
        data: { isFinished: false, progress: 60 }
      })
    }) 

    it('it should make the isFinished true when the are more than or equal newProgress and achievementBasis (Milestone)', async () => {
      const modifiedMock = {
        ...mockAchievementData,
        achievement: { ...mockAchievementData.achievement, taskType: 'Milestone', occurrence: undefined },
      }
      jest.spyOn(prisma.userAchievement, 'update').mockResolvedValue(mockReturnType as any)

      await service.updateProgress(modifiedMock, 100, 'Milestone')

      expect(prisma.userAchievement.update).toHaveBeenCalledWith({
        where: { id: mockAchievementData.id },
        data: { isFinished: true, progress: mockAchievementData.achievement.goal }
      })
    })
  })

  describe('recalculateProcessAchievement', () => {
    const mockUpdateProgressreturn = {
      id: "mockId",
      userId: "mockUserId",
      achievementId: "mockAchievementId",
      isFinished: false,
      progress: 50,
      dateFinised: null
    }

    const mockUserInfo = {
      completedChallenges: [
        { wpm: 120, accuracy: 90 },
        { wpm: 110, accuracy: 95 },
        { wpm: 130, accuracy: 85 }
      ],
    };
    
    const mockAchievement = {
      progress: 50,
      achievement: {
        goal: 100,
        occurence: 100,
        category: "WPM", // Testing WPM category
      },
      isFinished: false,
    };
    
    const newAchievement = {
      ...mockAchievement,
      achievement: {
        ...mockAchievement.achievement,
        category: "WPM",
      },
    };

    it('should update progress for WPM category when new progress is higher', async () => {
      // Mock updateProgress to test if it's called with correct arguments
      jest.spyOn(service, 'updateProgress').mockResolvedValue(mockUpdateProgressreturn as any)

      await service.recalculateProcessAchievement(newAchievement, mockUserInfo);

      expect(service.updateProgress).toHaveBeenCalledWith(newAchievement, 1, 'Process');
    });

    it('should not update progress when no progress change occurs', async () => {
      // Mock achievement with no progress change both progress and new progress will be zero
      const unchangedAchievement = {
        ...mockAchievement,
        progress: 0,
        achievement: {
          ...mockAchievement.achievement,
          category: mockAchievement.achievement.category,
          goal: 140
        },
      };

      jest.spyOn(service, 'updateProgress').mockResolvedValue(undefined);

      const result = await service.recalculateProcessAchievement(unchangedAchievement, mockUserInfo);

      expect(service.updateProgress).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });

    it('should update progress for Accuracy category when new progress is higher', async () => {
      // Mock achievement with progress change and also make it so that the goal is 95 and can be reached so the new progress will be 1
      const newAchievement = {
        ...mockAchievement,
        progress: 50,
        achievement: {
          ...mockAchievement.achievement,
          goal: 95,
          category: "Accuracy",
        },
      };

      jest.spyOn(service, 'updateProgress').mockResolvedValue(mockUpdateProgressreturn as any);

      await service.recalculateProcessAchievement(newAchievement, mockUserInfo);

      expect(service.updateProgress).toHaveBeenCalledWith(newAchievement, 1, 'Process');
    });

    it('should not update progress for Accuracy category when no progress change occurs', async () => {
      // the progress is already 0, so no progress change will occur
      const unchangedAchievement = {
        ...mockAchievement,
        progress: 0,
        achievement: {
          ...mockAchievement.achievement,
          category: "Accuracy",
        },
      };

      jest.spyOn(service, 'updateProgress').mockResolvedValue(undefined);

      const result = await service.recalculateProcessAchievement(unchangedAchievement, mockUserInfo);

      expect(service.updateProgress).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    });
  });

  describe('recalculateMilestoneAchievement', () => {
    const mockUpdateProgressreturn = {
      id: "mockId",
      userId: "mockUserId",
      achievementId: "mockAchievementId",
      isFinished: false,
      progress: 50,
      dateFinised: null
    }

    const mockUserInfo = {
      Biometrics: {
        AverageWpm: 90,
        AverageAccuracy: 90,
      },
      completedChallenges: [
        { wpm: 120, accuracy: 90 },
        { wpm: 110, accuracy: 95 },
        { wpm: 130, accuracy: 85 }
      ],
    };
    
    const mockAchievement = {
      progress: 50,
      achievement: {
        goal: 100,
        occurence: 100,
        category: "WPM", // Testing WPM category
      },
      isFinished: false,
    };
  
    it('should update progress for Challenges category when new progress is higher', async () => {
      const newAchievement = { ...mockAchievement, achievement: { ...mockAchievement.achievement, category: "Challenges" }, };
      
      jest.spyOn(service, 'updateProgress').mockResolvedValue(mockUpdateProgressreturn as any);

      await service.recalculateMilestoneAchievement(newAchievement, mockUserInfo);

      expect(service.updateProgress).toHaveBeenCalledWith(newAchievement, 3, 'Milestone');
    })

    it('should not update progress for Challenges category when no progress change occurs', async () => {
      const unchangedAchievement = { ...mockAchievement, progress: 3, achievement: { ...mockAchievement.achievement, category: "Challenges", }, };

      jest.spyOn(service, 'updateProgress').mockResolvedValue(undefined);

      const result = await service.recalculateMilestoneAchievement(unchangedAchievement, mockUserInfo);

      expect(service.updateProgress).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    })

    it('should update progress for WPM category when new progress is higher', async () => {
      
      jest.spyOn(service, 'updateProgress').mockResolvedValue(mockUpdateProgressreturn as any);

      await service.recalculateMilestoneAchievement(mockAchievement, mockUserInfo);

      expect(service.updateProgress).toHaveBeenCalledWith(mockAchievement, 90, 'Milestone');
    })

    it('should not update progress for WPM category when no progress change occurs', async () => {
      const unchangedAchievement = { ...mockAchievement, progress: 90 };

      jest.spyOn(service, 'updateProgress').mockResolvedValue(undefined);

      const result = await service.recalculateMilestoneAchievement(unchangedAchievement, mockUserInfo);

      expect(service.updateProgress).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    })

    it('should update progress for Accuracy category when new progress is higher', async () => {
      const newAchievement = { ...mockAchievement, achievement: { ...mockAchievement.achievement, category: "Accuracy" }, };

      jest.spyOn(service, 'updateProgress').mockResolvedValue(mockUpdateProgressreturn as any);

      await service.recalculateMilestoneAchievement(newAchievement, mockUserInfo);

      expect(service.updateProgress).toHaveBeenCalledWith(newAchievement, 90, 'Milestone');
    })

    it('should not update progress for Accuracy category when no progress change occurs', async () => {
      const unchangedAchievement = { ...mockAchievement, progress: 90, achievement: { ...mockAchievement.achievement, category: "Accuracy", }, };

      jest.spyOn(service, 'updateProgress').mockResolvedValue(undefined);

      const result = await service.recalculateMilestoneAchievement(unchangedAchievement, mockUserInfo);

      expect(service.updateProgress).not.toHaveBeenCalled();
      expect(result).toBeUndefined();
    })
  });
});
