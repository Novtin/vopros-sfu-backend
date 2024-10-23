import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1729660500294 implements MigrationInterface {
  name = 'Migration1729660500294';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tag" ("createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_6a9775008add570dc3e5a0bab7b" UNIQUE ("name"), CONSTRAINT "PK_8e4052373c579afc1471f526760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_tag" ("questionId" integer NOT NULL, "tagId" integer NOT NULL, CONSTRAINT "PK_5c0fd8f9c38b89d1ddf6386ad7e" PRIMARY KEY ("questionId", "tagId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_404f26e7998f708595e3c80098" ON "question_tag" ("questionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_6cec0f2e5d20028770ebd7e4df" ON "question_tag" ("tagId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "question_tag" ADD CONSTRAINT "FK_404f26e7998f708595e3c800985" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_tag" ADD CONSTRAINT "FK_6cec0f2e5d20028770ebd7e4dfe" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_tag" DROP CONSTRAINT "FK_6cec0f2e5d20028770ebd7e4dfe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_tag" DROP CONSTRAINT "FK_404f26e7998f708595e3c800985"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_6cec0f2e5d20028770ebd7e4df"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_404f26e7998f708595e3c80098"`,
    );
    await queryRunner.query(`DROP TABLE "question_tag"`);
    await queryRunner.query(`DROP TABLE "tag"`);
  }
}
