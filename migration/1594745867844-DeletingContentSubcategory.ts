import { MigrationInterface, QueryRunner } from 'typeorm';

export class DeletingContentSubcategory1594745867844
  implements MigrationInterface {
  name = 'DeletingContentSubcategory1594745867844';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP FOREIGN KEY `FK_3fc84b9483bdd736f728dbf95b2`',
      undefined,
    );
    await queryRunner.query('DROP TABLE `content_subcategory`');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE `sub_category` DROP FOREIGN KEY `FK_51b8c0b349725210c4bd8b9b7a7`',
      undefined,
    );
    await queryRunner.query(`CREATE TABLE content_subcategory (
            id int(11) NOT NULL AUTO_INCREMENT,
            title varchar(255) COLLATE utf8_unicode_ci NOT NULL,
            imagen varchar(255) COLLATE utf8_unicode_ci DEFAULT NULL,
            text varchar(255) COLLATE utf8_unicode_ci NOT NULL,
            link varchar(255) COLLATE utf8_unicode_ci NOT NULL,
            subCategoryId int(11) DEFAULT NULL,
            isActive tinyint(4) NOT NULL DEFAULT '1',
            PRIMARY KEY (id),
            KEY FK_74a238fdd935df699916df472f5 (subCategoryId),
            CONSTRAINT FK_74a238fdd935df699916df472f5 FOREIGN KEY (subCategoryId) REFERENCES sub_category (id)
          ) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;`);
  }
}
