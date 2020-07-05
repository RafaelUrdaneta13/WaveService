import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddingNullTrueForImages1593906386916
  implements MigrationInterface {
  name = 'AddingNullTrueForImages1593906386916';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `category` DROP FOREIGN KEY `FK_ca0e41a0f5f048595e7a2dfda4d`',
      undefined,
    );
    await queryRunner.query(
      'DROP INDEX `REL_ca0e41a0f5f048595e7a2dfda4` ON `category`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `category` DROP COLUMN `colorId`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `content_subcategory` CHANGE `imagen` `imagen` varchar(255) NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` CHANGE `image` `image` varchar(255) NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `content_category` CHANGE `imagen` `imagen` varchar(255) NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `category` CHANGE `image` `image` varchar(255) NULL',
      undefined,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP FOREIGN KEY `FK_51b8c0b349725210c4bd8b9b7a7`',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `category` CHANGE `image` `image` varchar(255) NOT NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `content_category` CHANGE `imagen` `imagen` varchar(255) NOT NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` CHANGE `image` `image` varchar(255) NOT NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `content_subcategory` CHANGE `imagen` `imagen` varchar(255) NOT NULL',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `category` ADD `colorId` int NULL',
      undefined,
    );
    await queryRunner.query(
      'CREATE UNIQUE INDEX `REL_ca0e41a0f5f048595e7a2dfda4` ON `category` (`colorId`)',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `category` ADD CONSTRAINT `FK_ca0e41a0f5f048595e7a2dfda4d` FOREIGN KEY (`colorId`) REFERENCES `color`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
    await queryRunner.query(
      'ALTER TABLE `sub_category` ADD CONSTRAINT `FK_3fc84b9483bdd736f728dbf95b2` FOREIGN KEY (`categoryId`) REFERENCES `category`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION',
      undefined,
    );
  }
}
