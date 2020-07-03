import { Test, TestingModule } from '@nestjs/testing';
import { ContentCategoryController } from './content-category.controller';

describe('ContentCategory Controller', () => {
  let controller: ContentCategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ContentCategoryController],
    }).compile();

    controller = module.get<ContentCategoryController>(ContentCategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
