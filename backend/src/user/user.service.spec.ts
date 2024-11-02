import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { ChallengeService } from '../challenge/challenge.service';
import { PrismaService } from '../prisma/prisma.service';
import { GoneException, NotFoundException } from '@nestjs/common';
import { UpdateAccount, UpdatePassword } from './dto/UpdateAccount.dto';
import * as bcrypt from 'bcrypt'
import * as fs from 'fs'

jest.mock('bcrypt')

describe('UserService', () => {
  let service: UserService;
  let prisma: PrismaService;
  let challengeService: ChallengeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService, ChallengeService, {
        provide: PrismaService,
        useValue: {
          user: {
            findFirst: jest.fn(),
            update: jest.fn(), 
            findUnique: jest.fn()
          },
          userPreferences: {
            findFirst: jest.fn(),
            update: jest.fn(), 
          },
        }
      }],  
    }).compile();

    challengeService = module.get<ChallengeService>(ChallengeService);
    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  const req = { user: { sub: '1' } };


  describe('getProfile', () => {
    const userId = '12ndsai2ods'
    const prismaQuery = {
      where: {
        id: userId
      },
      select: {
        id: true, 
        username: true, 
        profile: true,
      }
    }

    // the privateProfile is true and showStats is false // all private
    it('should just return id, username, and profile because privateProfile is true and showStats is false', async () => {
      jest.spyOn(prisma.userPreferences, 'findFirst').mockResolvedValue({ showStats: false, privateProfile: true } as any)
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({} as any) // this does not matter for this test

      const result = await service.getProfile(userId)
      expect(prisma.user.findUnique).toHaveBeenCalledWith(prismaQuery)
    })

    // the private profile is the focus so we are gonna make showStats as false
    it('should return email, userInfo, and completeChallenges if privateProfile is false', async () => {
      jest.spyOn(prisma.userPreferences, 'findFirst').mockResolvedValue({ showStats: false, privateProfile: false } as any)
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({} as any) // this does not matter for this test

      const result = await service.getProfile(userId)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        ...prismaQuery,
        select: {
          ...prismaQuery.select,
          email: true,
          userinfo: true,
          completedChallenges: true,
        }
      })
    }) 

    // the showStats are the focus so we are gonna make privateProfile as True
    it('should return Biometrics if showStats is true', async () => {
      jest.spyOn(prisma.userPreferences, 'findFirst').mockResolvedValue({ showStats: true, privateProfile: true } as any)
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue({} as any) // this does not matter for this test

      const result = await service.getProfile(userId)
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        ...prismaQuery,
        select: {
          ...prismaQuery.select,
          Biometrics: true
        }
      })
    })

    it('if the user does not exist, it should throw a notFound Exception', async () => {
      
      jest.spyOn(prisma.userPreferences, 'findFirst').mockResolvedValue(undefined)
      
      await expect(service.getProfile(userId)).rejects.toThrow(new NotFoundException({
        name: 'user',
        message: 'user is not found'
      })) 
    })

  })

  describe('getDashboardInformation', () => {

    it('should return the dashboard information', async () => {
      const mockDashboardInformation = {
        Biometrics: true,
        userinfo: true,
        completedChallenges: [
          {
            challenge: {
              id: '1',
              title: 'Challenge 1',
              difficulty: 'easy',
              createdAt: new Date(),
            }
          }
        ]
      } as any

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockDashboardInformation);

      const result = await service.getDashboardInformation(req);
      expect(result).toEqual({
        ...mockDashboardInformation,
        dailyChallengeId: expect.any(String)
      });
    })
  })

  describe('getUserInformation', () => {
    it('should return the user information', async () => {
      const mockUserInformation = {
        id: '1',
        email: 'renato@gmail.com',
        username: 'renato',
        profile: 'profile',
        userInfo: 'userInfo',
        preferences: 'preferences',
      } as any

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockUserInformation);

      const result = await service.getUserInformation(req);

      expect(result).toEqual(mockUserInformation);
    })

    it('should throw an error if the user is not found', async () => {
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(undefined);

      await expect(service.getUserInformation(req)).rejects.toThrow( new NotFoundException({
        name: 'User Information',
        message: 'User Info not Found'
      }));
    })
  })  

  describe('DeleteProfileFile', () => {
    it('should delete profileFile', async () => {
      jest.spyOn(fs, 'unlink').mockImplementation(() => Promise.resolve());

      const result = await service.DeleteProfileFile('http://localhost:5000/Uploads/e6c42da0152639392c0a_https___-28e83b26770f.jpg')

      expect(result).toEqual("e6c42da0152639392c0a_https___-28e83b26770f.jpg got deleted")
    })
  })

  describe('uploadProfile', () => {
    it('it should format the pathFile to the desiredLocation', async () => {
      const profileFile = {
        path: 'uploads/2318csd_examplePhoto.jpeg'
      } as Express.Multer.File
      const resultedFile = process.env.BASE_BACKEND_URL + "/" + profileFile.path.split('\\').join('/')

      jest.spyOn(prisma.user, 'update').mockResolvedValue({
        id: 'dsauhewoask',
        profile: resultedFile
      } as any)

      await service.uploadProfile(profileFile, req.user.sub)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: req.user.sub
        },
        data: {
          profile: resultedFile
        },
        select: {
          profile: true
        }
      })
    })
  })  

  describe('updateAccount', () => {
    const mockUpdateAccount = {
      username: 'renato',
      email: 'renatoDsantosJr@gmail.com'
    } as UpdateAccount
    const mockPrismaResponse = mockUpdateAccount as any  

    it('should update account without calling uploadProfile if no file is Provided', async () => {
        
      jest.spyOn(prisma.user, 'update').mockResolvedValue(mockPrismaResponse)
      jest.spyOn(service, 'uploadProfile').mockResolvedValue(undefined)
      const result = await service.updateAccount(mockUpdateAccount, undefined, req)

      expect(service.uploadProfile).not.toHaveBeenCalled()
      expect(result).toEqual(mockPrismaResponse)
    })

    it('should update account and call uploadProfile if file is Provided', async () => {
      const mockFile = {
        path: 'uploads/2318csd_examplePhoto.jpeg'
      } as Express.Multer.File

      jest.spyOn(prisma.user, 'update').mockResolvedValue(mockPrismaResponse)
      jest.spyOn(service, 'uploadProfile').mockResolvedValue({profile: 'http://localhost:5000/Upload/3213132_examplePhoto.jpeg'})
    
      const result = await service.updateAccount(mockUpdateAccount, mockFile, req)

      expect(service.uploadProfile).toHaveBeenCalled()
      expect(result).toEqual(mockPrismaResponse)
    })
  })

  describe('updatePassword' , () => {
    let mockBody = {
      password: 'renato',
      newPassword: 'renato000',
      confirmPassword: 'renato000'
    } as UpdatePassword

    it('if newpassword does not equal to confirmPassword throw goneException', async () => {
      const mockPasswordnotEqual = {
        ...mockBody,
        newPassword: 'renato999' // newpassword that is not equal to confirmpassword
      }
      await expect(service.updatePassword(mockPasswordnotEqual, req)).rejects.toThrow(new GoneException({
        name: 'confirmPassword',
        message: 'confirmPassword does not match'
      }))
    })

    it('if password is not equal to the user password should throw goneException', async () => {
      const mockgetPassword = { password: 'renato000' } as any
      
      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockgetPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false)

      await expect(service.updatePassword(mockBody, req)).rejects.toThrow( new GoneException({
        name: 'password',
        message: 'wrong password'
      }))
    })

    it('if everything is correct, then we should hashed password and update it and return it to the user', async () => {
      const mockgetPassword = { password: 'renato' } as any
      const prismaMockUpdateResponse = {password: 'exampleHashing'} as any

      jest.spyOn(prisma.user, 'findFirst').mockResolvedValue(mockgetPassword);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('exampleHashing');
      jest.spyOn(prisma.user, 'update').mockResolvedValue(prismaMockUpdateResponse)

      const result = await service.updatePassword(mockBody, req)

      expect(result).toEqual(prismaMockUpdateResponse)
      expect(prisma.user.update).toHaveBeenCalledWith({
        where: {
          id: req.user.sub
        },
        data: {
          password: 'exampleHashing'
        }
      })
    })
  })

  // i didnot put updatePrivacySettings and also updateTypePreferences because theyre just updating database and no logic at all

});
