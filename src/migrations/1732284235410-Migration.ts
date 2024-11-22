import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1732284235410 implements MigrationInterface {
  name = 'Migration1732284235410';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "question_favorite" ("id" SERIAL NOT NULL, "questionId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_c1c95d2548c241ab903eabce7c4" UNIQUE ("questionId", "userId"), CONSTRAINT "PK_dfdc8dde4eedb94841fed0d1214" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_favorite" ADD CONSTRAINT "FK_741e0617ad17513c6938861d7bb" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_favorite" ADD CONSTRAINT "FK_166ea8126dfcccb410cf9249df0" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_favorite" DROP CONSTRAINT "FK_166ea8126dfcccb410cf9249df0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_favorite" DROP CONSTRAINT "FK_741e0617ad17513c6938861d7bb"`,
    );
    await queryRunner.query(`DROP TABLE "question_favorite"`);
  }
}
