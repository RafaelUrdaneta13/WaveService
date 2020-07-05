import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingActiveToAllEntities1593823629091
  implements MigrationInterface {
  name = 'AddingActiveToAllEntities1593823629091';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `forum` ADD `isActive` tinyint NOT NULL DEFAULT 1',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `content_subcategory` ADD `isActive` tinyint NOT NULL DEFAULT 1',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` ADD `isActive` tinyint NOT NULL DEFAULT 1',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `content_category` ADD `isActive` tinyint NOT NULL DEFAULT 1',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `category` ADD `isActive` tinyint NOT NULL DEFAULT 1',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `category` DROP COLUMN `isActive`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `content_category` DROP COLUMN `isActive`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP COLUMN `isActive`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `content_subcategory` DROP COLUMN `isActive`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `forum` DROP COLUMN `isActive`',
      undefined,
    );
  }
}
