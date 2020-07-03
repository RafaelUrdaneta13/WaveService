import { Test, TestingModule } from '@nestjs/testing';
import { ContentCategoryService } from './content-category.service';

describe('ContentCategoryService', () => {
  let service: ContentCategoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ContentCategoryService],
    }).compile();

    service = module.get<ContentCategoryService>(ContentCategoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
