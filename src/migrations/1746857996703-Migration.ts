import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1746857996703 implements MigrationInterface {
  name = 'Migration1746857996703';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tag_favorite" ("tagId" integer NOT NULL, "userId" integer NOT NULL, CONSTRAINT "UQ_d40f3f1e43f94574e023017919c" UNIQUE ("tagId", "userId"), CONSTRAINT "PK_d40f3f1e43f94574e023017919c" PRIMARY KEY ("tagId", "userId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag_favorite" ADD CONSTRAINT "FK_3087d235618142d3e56f768d9d9" FOREIGN KEY ("tagId") REFERENCES "tag"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag_favorite" ADD CONSTRAINT "FK_292e6c462a71fe7207979f19711" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tag_favorite" DROP CONSTRAINT "FK_292e6c462a71fe7207979f19711"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tag_favorite" DROP CONSTRAINT "FK_3087d235618142d3e56f768d9d9"`,
    );
    await queryRunner.query(`DROP TABLE "tag_favorite"`);
  }
}
