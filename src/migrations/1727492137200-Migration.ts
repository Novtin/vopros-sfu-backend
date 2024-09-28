import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1727492137200 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "role" (name) VALUES ('admin'), ('user')`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM "role" WHERE "role"."name" = 'admin' OR  "role"."name" = 'user'`,
    );
  }
}
