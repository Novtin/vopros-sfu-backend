import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1730618139707 implements MigrationInterface {
  name = 'Migration1730618139707';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "question_view" ("id" SERIAL NOT NULL, "questionId" integer NOT NULL, "userId" integer, CONSTRAINT "PK_35c4590bf8a0415daf5560dc231" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ADD CONSTRAINT "FK_cbbf373ee33e65aeaa791738dcb" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ADD CONSTRAINT "FK_b2aa40ad8fda4a0e965c554e454" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_view" DROP CONSTRAINT "FK_b2aa40ad8fda4a0e965c554e454"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" DROP CONSTRAINT "FK_cbbf373ee33e65aeaa791738dcb"`,
    );
    await queryRunner.query(`DROP TABLE "question_view"`);
  }
}
