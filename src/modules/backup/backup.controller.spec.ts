import { Test, TestingModule } from '@nestjs/testing';
import { BackupController } from './backup.controller';
import { BackupService } from './backup.service';

describe('BackupController', () => {
  let controller: BackupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BackupController],
      providers: [BackupService],
    }).compile();

    controller = module.get<BackupController>(BackupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
