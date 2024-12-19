import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1729047142779 implements MigrationInterface {
  name = 'Migration1729047142779';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isConfirmed" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "emailHash" character varying NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailHash"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isConfirmed"`);
  }
}
