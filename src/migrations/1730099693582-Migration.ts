import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1730099693582 implements MigrationInterface {
  name = 'Migration1730099693582';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "isResolved"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question" ADD "isResolved" boolean NOT NULL DEFAULT false`,
    );
  }
}
