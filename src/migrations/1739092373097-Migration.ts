import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739092373097 implements MigrationInterface {
  name = 'Migration1739092373097';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_code" ADD "isUsed" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "auth_code" DROP COLUMN "isUsed"`);
  }
}
