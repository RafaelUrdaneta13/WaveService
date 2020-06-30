import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserCreatorToForum1593540838724 implements MigrationInterface {
  name = 'AddUserCreatorToForum1593540838724';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `forum` ADD `userEmail` varchar(255) NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `forum` ADD CONSTRAINT `FK_38e8f8d12d2ab009fcdbaf45f43` FOREIGN KEY (`userEmail`) REFERENCES `user`(`email`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `forum` DROP FOREIGN KEY `FK_38e8f8d12d2ab009fcdbaf45f43`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `forum` DROP COLUMN `userEmail`',
      undefined,
    );
  }
}
