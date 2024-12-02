import { Test, TestingModule } from '@nestjs/testing';
import { OwnedByController } from './owned-by.controller';
import { OwnedByService } from './owned-by.service';

describe('OwnedByController', () => {
  let controller: OwnedByController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OwnedByController],
      providers: [OwnedByService],
    }).compile();

    controller = module.get<OwnedByController>(OwnedByController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
