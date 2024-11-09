import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1731133594100 implements MigrationInterface {
  name = 'Migration1731133594100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "answer_rating" ("id" SERIAL NOT NULL, "answerId" integer NOT NULL, "userId" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "UQ_bace91f478cfda7f8e2c61e42d7" UNIQUE ("answerId", "userId"), CONSTRAINT "CHK_960b7935d5a40119e52f65407a" CHECK ("value" IN (-1, 1)), CONSTRAINT "PK_b9410e59015a0c8f55d5ff8d9b7" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_rating" ("id" SERIAL NOT NULL, "questionId" integer NOT NULL, "userId" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "UQ_3aee21941433d20f635762a72f7" UNIQUE ("questionId", "userId"), CONSTRAINT "CHK_15ce2d59c17f07115140a4b924" CHECK ("value" IN (-1, 1)), CONSTRAINT "PK_317bfb165b55cd4380fbad6c27a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "rating"`);
    await queryRunner.query(
      `ALTER TABLE "answer_rating" ADD CONSTRAINT "FK_6c1afdf6c95b78c6349ba386815" FOREIGN KEY ("answerId") REFERENCES "answer"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_rating" ADD CONSTRAINT "FK_0b43d0bc6c01e35937bb5d463d2" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_rating" ADD CONSTRAINT "FK_835757d8fcd3cc1c7885de04268" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_rating" ADD CONSTRAINT "FK_22d6428b3479df3a0aeb8998246" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_rating" DROP CONSTRAINT "FK_22d6428b3479df3a0aeb8998246"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_rating" DROP CONSTRAINT "FK_835757d8fcd3cc1c7885de04268"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_rating" DROP CONSTRAINT "FK_0b43d0bc6c01e35937bb5d463d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_rating" DROP CONSTRAINT "FK_6c1afdf6c95b78c6349ba386815"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD "rating" integer NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(`DROP TABLE "question_rating"`);
    await queryRunner.query(`DROP TABLE "answer_rating"`);
  }
}
