import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1729670697441 implements MigrationInterface {
  name = 'Migration1729670697441';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "question_image" ("questionId" integer NOT NULL, "fileId" integer NOT NULL, CONSTRAINT "PK_8f7d455e2ae5c705e7c72ab7aba" PRIMARY KEY ("questionId", "fileId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_3cf408abaa0449a577aa8aa0fd" ON "question_image" ("questionId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2324beb3c89ab0efc67ab7d32" ON "question_image" ("fileId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "question_image" ADD CONSTRAINT "FK_3cf408abaa0449a577aa8aa0fd9" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_image" ADD CONSTRAINT "FK_b2324beb3c89ab0efc67ab7d322" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "question_image" DROP CONSTRAINT "FK_b2324beb3c89ab0efc67ab7d322"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_image" DROP CONSTRAINT "FK_3cf408abaa0449a577aa8aa0fd9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2324beb3c89ab0efc67ab7d32"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_3cf408abaa0449a577aa8aa0fd"`,
    );
    await queryRunner.query(`DROP TABLE "question_image"`);
  }
}
