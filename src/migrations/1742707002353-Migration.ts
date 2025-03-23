import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1742707002353 implements MigrationInterface {
  name = 'Migration1742707002353';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "deletedAt"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "file" ADD "deletedAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "file" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
  }
}
