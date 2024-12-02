import { Test, TestingModule } from '@nestjs/testing';
import { OwnedByService } from './owned-by.service';

describe('OwnedByService', () => {
  let service: OwnedByService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OwnedByService],
    }).compile();

    service = module.get<OwnedByService>(OwnedByService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
