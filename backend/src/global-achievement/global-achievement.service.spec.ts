import { Test, TestingModule } from '@nestjs/testing';
import { GlobalAchievementService } from './global-achievement.service';

describe('GlobalAchievementService', () => {
  let service: GlobalAchievementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GlobalAchievementService],
    }).compile();

    service = module.get<GlobalAchievementService>(GlobalAchievementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
