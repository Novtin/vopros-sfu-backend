import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1731134830141 implements MigrationInterface {
  name = 'Migration1731134830141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_view" ADD CONSTRAINT "UQ_a4d3a0d279c2b0c0b04133f396c" UNIQUE ("questionId", "userId")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_view" DROP CONSTRAINT "UQ_a4d3a0d279c2b0c0b04133f396c"`,
    );
  }
}
