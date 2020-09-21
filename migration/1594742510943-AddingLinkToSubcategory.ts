import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingLinkToSubcategory1594742510943
  implements MigrationInterface {
  name = 'AddingLinkToSubcategory1594742510943';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sub_category` ADD `link` varchar(255) NOT NULL',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP COLUMN `link`',
      undefined,
    );
  }
}
