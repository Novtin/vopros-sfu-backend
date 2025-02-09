import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739082922452 implements MigrationInterface {
  name = 'Migration1739082922452';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."auth_code_type_enum" AS ENUM('register_user', 'reset_password_user')`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth_code" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "type" "public"."auth_code_type_enum" NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "isActiveAt" TIMESTAMP NOT NULL DEFAULT NOW() + INTERVAL '1 hour', "availableAttempts" integer NOT NULL DEFAULT '5', "userId" integer, CONSTRAINT "PK_79343e6f9a8993c26d9047b480b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "emailHash"`);
    await queryRunner.query(
      `ALTER TABLE "auth_code" ADD CONSTRAINT "FK_b26bf93f5a27037792ccc89e791" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "auth_code" DROP CONSTRAINT "FK_b26bf93f5a27037792ccc89e791"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "emailHash" character varying NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "auth_code"`);
    await queryRunner.query(`DROP TYPE "public"."auth_code_type_enum"`);
  }
}
