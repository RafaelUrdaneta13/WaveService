import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class FillingUsers1590266082384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    /*await queryRunner.query(
      `INSERT INTO user (firstName, lastName, userName, email, password, birthday, isActive) VALUES ('Paola', 'Outeda', 'paolaouteda', 'paolaouteda@gmail.com', '2fb54875d166ab45a6a8b21f1631dec573a8cf07', '1995-08-09 23:59:59', 1)`,
    );
    queryRunner.commitTransaction();*/

    await queryRunner.query(`CREATE TABLE  color  (
       id  int NOT NULL AUTO_INCREMENT,
       color  varchar(255) NOT NULL,
      PRIMARY KEY ( id )
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`);

    await queryRunner.query(`CREATE TABLE category (
       id  int NOT NULL AUTO_INCREMENT,
       name  varchar(255) NOT NULL,
       colorId  int DEFAULT NULL,
      PRIMARY KEY ( id ),
      UNIQUE KEY  REL_ca0e41a0f5f048595e7a2dfda4  ( colorId ),
      CONSTRAINT  FK_ca0e41a0f5f048595e7a2dfda4d  FOREIGN KEY ( colorId ) REFERENCES  color  ( id )
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`);

    await queryRunner.query(`CREATE TABLE user (
      email varchar(255) NOT NULL,
      firstName varchar(255) NOT NULL,
      lastName varchar(255) NOT NULL,
      userName varchar(255) NOT NULL,
      password varchar(255) NOT NULL,
      birthday datetime NOT NULL,
      isActive tinyint NOT NULL DEFAULT '1',
      role enum('admin','normal','premium') NOT NULL DEFAULT 'normal',
      PRIMARY KEY (email),
      UNIQUE KEY IDX_da5934070b5f2726ebfd3122c8 (userName)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
    `);

    await queryRunner.query(`CREATE TABLE  content_category  (
     id  int NOT NULL AUTO_INCREMENT,
     title  varchar(255) NOT NULL,
     imagen  varchar(255) NOT NULL,
     text  varchar(255) NOT NULL,
     link  varchar(255) NOT NULL,
     categoryId  int DEFAULT NULL,
    PRIMARY KEY ( id ),
    KEY  FK_4459c498ae162e02c1522697daa  ( categoryId ),
    CONSTRAINT  FK_4459c498ae162e02c1522697daa  FOREIGN KEY ( categoryId ) REFERENCES  category  ( id )
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE  sub_category  (
     id  int NOT NULL AUTO_INCREMENT,
     name  varchar(255) NOT NULL,
     categoryId  int DEFAULT NULL,
    PRIMARY KEY ( id ),
    KEY  FK_3fc84b9483bdd736f728dbf95b2  ( categoryId ),
    CONSTRAINT  FK_3fc84b9483bdd736f728dbf95b2  FOREIGN KEY ( categoryId ) REFERENCES  category  ( id )
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE content_subcategory (
      id int NOT NULL AUTO_INCREMENT,
      title varchar(255) NOT NULL,
      imagen varchar(255) NOT NULL,
      text varchar(255) NOT NULL,
      link varchar(255) NOT NULL,
      subCategoryId int DEFAULT NULL,
      PRIMARY KEY (id),
      KEY FK_74a238fdd935df699916df472f5 (subCategoryId),
      CONSTRAINT FK_74a238fdd935df699916df472f5 FOREIGN KEY (subCategoryId) REFERENCES sub_category (id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE forum (
      id int NOT NULL AUTO_INCREMENT,
      title varchar(255) NOT NULL,
      subCategoryId int DEFAULT NULL,
      PRIMARY KEY (id),
      KEY FK_83186d94550346daa2dd7986add (subCategoryId),
      CONSTRAINT FK_83186d94550346daa2dd7986add FOREIGN KEY (subCategoryId) REFERENCES sub_category (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE post (
    id int NOT NULL AUTO_INCREMENT,
    text varchar(255) NOT NULL,
    isReported tinyint NOT NULL DEFAULT '0',
    forumId int DEFAULT NULL,
    userEmail varchar(255) DEFAULT NULL,
    PRIMARY KEY (id),
    KEY FK_c677952115eaa26692f819235cd (forumId),
    KEY FK_b6a3397e33ab179a2c7d64705b9 (userEmail),
    CONSTRAINT FK_b6a3397e33ab179a2c7d64705b9 FOREIGN KEY (userEmail) REFERENCES user (email),
    CONSTRAINT FK_c677952115eaa26692f819235cd FOREIGN KEY (forumId) REFERENCES forum (id)
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE category_users_user (
    categoryId int NOT NULL,
    userEmail varchar(255) NOT NULL,
    PRIMARY KEY (categoryId,userEmail),
    KEY IDX_4f27784253b16e9a65eac7c577 (categoryId),
    KEY IDX_9d3d31a2b96b414ee0c9baaafb (userEmail),
    CONSTRAINT FK_4f27784253b16e9a65eac7c5773 FOREIGN KEY (categoryId) REFERENCES category (id) ON DELETE CASCADE,
    CONSTRAINT FK_9d3d31a2b96b414ee0c9baaafbe FOREIGN KEY (userEmail) REFERENCES user (email) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE forum_users_user (
    forumId int NOT NULL,
    userEmail varchar(255) NOT NULL,
    PRIMARY KEY (forumId,userEmail),
    KEY IDX_adb18210c64f151a82bd1548d6 (forumId),
    KEY IDX_e9a460ffe92496da9f198be89f (userEmail),
    CONSTRAINT FK_adb18210c64f151a82bd1548d6a FOREIGN KEY (forumId) REFERENCES forum (id) ON DELETE CASCADE,
    CONSTRAINT FK_e9a460ffe92496da9f198be89fd FOREIGN KEY (userEmail) REFERENCES user (email) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.query(`CREATE TABLE post_users_user (
    postId int NOT NULL,
    userEmail varchar(255) NOT NULL,
    PRIMARY KEY (postId,userEmail),
    KEY IDX_d910e0368cef95f0ad01aebe6b (postId),
    KEY IDX_d82e076ed3e78afe90b201e817 (userEmail),
    CONSTRAINT FK_d82e076ed3e78afe90b201e8172 FOREIGN KEY (userEmail) REFERENCES user (email) ON DELETE CASCADE,
    CONSTRAINT FK_d910e0368cef95f0ad01aebe6ba FOREIGN KEY (postId) REFERENCES post (id) ON DELETE CASCADE
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
  `);

    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user')
      .values({
        firstName: 'Paola',
        lastName: 'Outeda',
        userName: 'paolaouteda',
        email: 'paolaouteda@gmail.com',
        password: '8b959c05562f6b3f925b957b1984960049d35983',
        birthday: '1995-08-09 23:59:59',
      })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DELETE FROM wave.user WHERE (email = 'paolaouteda@gmail.com')`,
    );
  }
}
