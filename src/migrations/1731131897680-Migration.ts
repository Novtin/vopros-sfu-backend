import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1731131897680 implements MigrationInterface {
  name = 'Migration1731131897680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "question_rate" ("id" SERIAL NOT NULL, "questionId" integer NOT NULL, "userId" integer NOT NULL, "value" integer NOT NULL, CONSTRAINT "CHK_f7394422868d1653ebc2cd9583" CHECK ("value" IN (-1, 1)), CONSTRAINT "PK_8424451d102acd267eeb6b4b3cd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" DROP CONSTRAINT "FK_b2aa40ad8fda4a0e965c554e454"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ALTER COLUMN "userId" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_rate" ADD CONSTRAINT "FK_a19986c4f3bd84eeb8b36f66087" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_rate" ADD CONSTRAINT "FK_706b6a2ea0afea09924bdfbb1fb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "question_rate" DROP CONSTRAINT "FK_706b6a2ea0afea09924bdfbb1fb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_rate" DROP CONSTRAINT "FK_a19986c4f3bd84eeb8b36f66087"`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ALTER COLUMN "userId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "question_view" ADD CONSTRAINT "FK_b2aa40ad8fda4a0e965c554e454" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(`DROP TABLE "question_rate"`);
  }
}
