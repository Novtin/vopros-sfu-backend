import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1743313226525 implements MigrationInterface {
  name = 'Migration1743313226525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_login" DROP CONSTRAINT "PK_925e8e14bb74e91fc95c90ef0d1"`,
    );
    await queryRunner.query(`ALTER TABLE "auth_login" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "auth_login" ADD "id" uuid NOT NULL DEFAULT uuid_generate_v4()`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_login" ADD CONSTRAINT "PK_925e8e14bb74e91fc95c90ef0d1" PRIMARY KEY ("id")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_login" DROP CONSTRAINT "PK_925e8e14bb74e91fc95c90ef0d1"`,
    );
    await queryRunner.query(`ALTER TABLE "auth_login" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "auth_login" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_login" ADD CONSTRAINT "PK_925e8e14bb74e91fc95c90ef0d1" PRIMARY KEY ("id")`,
    );
  }
}
