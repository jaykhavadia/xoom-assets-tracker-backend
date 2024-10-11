import { Test, TestingModule } from '@nestjs/testing';
import { FilesHelperService } from './files-helper.service';

describe('FilesHelperService', () => {
  let service: FilesHelperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FilesHelperService],
    }).compile();

    service = module.get<FilesHelperService>(FilesHelperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
