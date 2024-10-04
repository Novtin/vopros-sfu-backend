import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1728013400555 implements MigrationInterface {
  name = 'Migration1728013400555';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "question" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "authorId" integer NOT NULL, "description" character varying NOT NULL, "rating" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "question"`);
  }
}
