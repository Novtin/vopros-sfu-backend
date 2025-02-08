import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738998272512 implements MigrationInterface {
  name = 'Migration1738998272512';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isOnline" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "wasOnlineAt" TIMESTAMP`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "wasOnlineAt"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isOnline"`);
  }
}
