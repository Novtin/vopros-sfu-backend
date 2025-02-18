import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739887334081 implements MigrationInterface {
  name = 'Migration1739887334081';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "auth_login" ("id" SERIAL NOT NULL, "accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "isLogout" boolean NOT NULL DEFAULT false, "userId" integer, "ipAddress" character varying NOT NULL, CONSTRAINT "PK_925e8e14bb74e91fc95c90ef0d1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_code" ALTER COLUMN "isActiveAt" SET DEFAULT NOW() + INTERVAL '1 hour'`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_login" ADD CONSTRAINT "FK_be3b69b6401c63364432156b344" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_login" DROP CONSTRAINT "FK_be3b69b6401c63364432156b344"`,
    );
    await queryRunner.query(
      `ALTER TABLE "auth_code" ALTER COLUMN "isActiveAt" SET DEFAULT (now() + '01:00:00')`,
    );
    await queryRunner.query(`DROP TABLE "auth_login"`);
  }
}
