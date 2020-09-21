import { MigrationInterface, QueryRunner } from 'typeorm';
import { userRole } from 'src/helpers/constants';

export class AddingSuperAdmin1595025094349 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `role` `role` enum ('superadmin', 'admin', 'normal', 'premium') NOT NULL DEFAULT 'normal'",
      undefined,
    );
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user')
      .values({
        firstName: 'Administrator',
        lastName: 'Wave',
        userName: 'waveAdmin',
        email: 'admin@wave.com',
        password: 'f9556fb1ac0a42e0dfa08b6b7e6ab832af8dc6b5',
        birthday: '1995-08-09 23:59:59',
        image: null,
        role: userRole.ADMIN,
      })
      .execute();
    await queryRunner.manager
      .createQueryBuilder()
      .insert()
      .into('user')
      .values({
        firstName: 'SuperAdministrator',
        lastName: 'Wave',
        userName: 'waveSuperAdmin',
        email: 'superadmin@wave.com',
        password: '1ce7e8902cc625cd46cc00134b6b078461e1f99e',
        birthday: '1995-08-09 23:59:59',
        image: null,
        role: userRole.SUPER_ADMIN,
      })
      .execute();
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(
      "ALTER TABLE `user` CHANGE `role` `role` enum ('admin', 'normal', 'premium') NOT NULL DEFAULT 'normal'",
      undefined,
    );
  }
}
