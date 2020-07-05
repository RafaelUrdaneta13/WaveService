import { MigrationInterface, QueryRunner } from 'typeorm';

export class CategoryAndSubAddImageAndText1593822577057
  implements MigrationInterface {
  name = 'CategoryAndSubAddImageAndText1593822577057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sub_category` ADD `image` varchar(255) NOT NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` ADD `text` varchar(255) NOT NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `category` ADD `image` varchar(255) NOT NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `category` ADD `text` varchar(255) NOT NULL',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `category` DROP COLUMN `text`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `category` DROP COLUMN `image`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP COLUMN `text`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP COLUMN `image`',
      undefined,
    );
  }
}
