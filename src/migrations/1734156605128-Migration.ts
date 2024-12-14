import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734156605128 implements MigrationInterface {
  name = 'Migration1734156605128';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_view" DROP CONSTRAINT "PK_35c4590bf8a0415daf5560dc231"`,
    );
    await queryRunner.query(`ALTER TABLE "question_view" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "question_rating" DROP CONSTRAINT "PK_317bfb165b55cd4380fbad6c27a"`,
    );
    await queryRunner.query(`ALTER TABLE "question_rating" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "question_favorite" DROP CONSTRAINT "PK_dfdc8dde4eedb94841fed0d1214"`,
    );
    await queryRunner.query(`ALTER TABLE "question_favorite" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "answer_rating" DROP CONSTRAINT "PK_b9410e59015a0c8f55d5ff8d9b7"`,
    );
    await queryRunner.query(`ALTER TABLE "answer_rating" DROP COLUMN "id"`);
    await queryRunner.query(
      `ALTER TABLE "question_view" ADD CONSTRAINT "PK_a4d3a0d279c2b0c0b04133f396c" PRIMARY KEY ("questionId", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_rating" ADD CONSTRAINT "PK_3aee21941433d20f635762a72f7" PRIMARY KEY ("questionId", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_favorite" ADD CONSTRAINT "PK_c1c95d2548c241ab903eabce7c4" PRIMARY KEY ("questionId", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_rating" ADD CONSTRAINT "PK_bace91f478cfda7f8e2c61e42d7" PRIMARY KEY ("answerId", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" DROP CONSTRAINT "FK_b2aa40ad8fda4a0e965c554e454"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" DROP CONSTRAINT "UQ_a4d3a0d279c2b0c0b04133f396c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ADD CONSTRAINT "UQ_a4d3a0d279c2b0c0b04133f396c" UNIQUE ("questionId", "userId")`,
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
      `ALTER TABLE "question_view" DROP CONSTRAINT "UQ_a4d3a0d279c2b0c0b04133f396c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ADD CONSTRAINT "UQ_a4d3a0d279c2b0c0b04133f396c" UNIQUE ("questionId", "userId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ADD CONSTRAINT "FK_b2aa40ad8fda4a0e965c554e454" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_rating" DROP CONSTRAINT "PK_bace91f478cfda7f8e2c61e42d7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_favorite" DROP CONSTRAINT "PK_c1c95d2548c241ab903eabce7c4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_rating" DROP CONSTRAINT "PK_3aee21941433d20f635762a72f7"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" DROP CONSTRAINT "PK_a4d3a0d279c2b0c0b04133f396c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_rating" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_rating" ADD CONSTRAINT "PK_b9410e59015a0c8f55d5ff8d9b7" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_favorite" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_favorite" ADD CONSTRAINT "PK_dfdc8dde4eedb94841fed0d1214" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_rating" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_rating" ADD CONSTRAINT "PK_317bfb165b55cd4380fbad6c27a" PRIMARY KEY ("id")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ADD "id" SERIAL NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ADD CONSTRAINT "PK_35c4590bf8a0415daf5560dc231" PRIMARY KEY ("id")`,
    );
  }
}
