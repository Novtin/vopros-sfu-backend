import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1728483910559 implements MigrationInterface {
  name = 'Migration1728483910559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "file" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, "size" integer NOT NULL, "mimetype" character varying NOT NULL, CONSTRAINT "PK_36b46d232307066b3a2c9ea3a1d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_image" ("questionId_1" integer NOT NULL, "questionId_2" integer NOT NULL, CONSTRAINT "PK_e36335c21a728455ec741a6b2bc" PRIMARY KEY ("questionId_1", "questionId_2"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_73fac5ef7e41b9274ee36aa137" ON "question_image" ("questionId_1") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7825d85a6a4413326e8522de29" ON "question_image" ("questionId_2") `,
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "avatarId" integer`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_58f5c71eaab331645112cf8cfa5" UNIQUE ("avatarId")`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "question" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5" FOREIGN KEY ("avatarId") REFERENCES "file"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" ADD CONSTRAINT "FK_75fc761f2752712276be38e7d13" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_image" ADD CONSTRAINT "FK_73fac5ef7e41b9274ee36aa1377" FOREIGN KEY ("questionId_1") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_image" ADD CONSTRAINT "FK_7825d85a6a4413326e8522de299" FOREIGN KEY ("questionId_2") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_image" DROP CONSTRAINT "FK_7825d85a6a4413326e8522de299"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_image" DROP CONSTRAINT "FK_73fac5ef7e41b9274ee36aa1377"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question" DROP CONSTRAINT "FK_75fc761f2752712276be38e7d13"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_58f5c71eaab331645112cf8cfa5"`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "updatedAt"`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "UQ_58f5c71eaab331645112cf8cfa5"`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "avatarId"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7825d85a6a4413326e8522de29"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_73fac5ef7e41b9274ee36aa137"`,
    );
    await queryRunner.query(`DROP TABLE "question_image"`);
    await queryRunner.query(`DROP TABLE "file"`);
  }
}
