import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingSubscriber1595281145959 implements MigrationInterface {
  name = 'AddingSubscriber1595281145959';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE `subscriber` (`endpoint` varchar(255) NOT NULL, `encriptionKey` varchar(255) NOT NULL, `authSecret` varchar(255) NOT NULL, `userEmail` varchar(255) NOT NULL, UNIQUE INDEX `REL_bfdcbb1ed07dd59547527a81ba` (`userEmail`), PRIMARY KEY (`userEmail`)) ENGINE=InnoDB',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `subscriber` ADD CONSTRAINT `FK_bfdcbb1ed07dd59547527a81bae` FOREIGN KEY (`userEmail`) REFERENCES `user`(`email`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `subscriber` DROP FOREIGN KEY `FK_bfdcbb1ed07dd59547527a81bae`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `REL_bfdcbb1ed07dd59547527a81ba` ON `subscriber`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `subscriber`', undefined);
  }
}
