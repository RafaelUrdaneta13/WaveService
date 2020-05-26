import { MigrationInterface, QueryRunner } from 'typeorm';

export class FillingUsers1590266082384 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
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
        isActive: 1,
      })
      .execute();
    /*await queryRunner.query(
      `INSERT INTO user (firstName, lastName, userName, email, password, birthday, isActive) VALUES ('Paola', 'Outeda', 'paolaouteda', 'paolaouteda@gmail.com', '2fb54875d166ab45a6a8b21f1631dec573a8cf07', '1995-08-09 23:59:59', 1)`,
    );
    queryRunner.commitTransaction();*/
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      `DELETE FROM wave.user WHERE (email = 'paolaouteda@gmail.com')`,
    );
  }
}
