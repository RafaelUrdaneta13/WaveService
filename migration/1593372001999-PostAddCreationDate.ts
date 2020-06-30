import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostAddCreationDate1593372001999 implements MigrationInterface {
  name = 'PostAddCreationDate1593372001999';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `post` ADD `date` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE `post` DROP COLUMN `date`', undefined);
  }
}
