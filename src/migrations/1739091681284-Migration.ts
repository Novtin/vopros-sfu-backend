import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739091681284 implements MigrationInterface {
  name = 'Migration1739091681284';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "wasOnlineAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "wasOnlineAt" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIME WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updatedAt" TIME WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "deletedAt" TIME WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD "createdAt" TIME WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD "updatedAt" TIME WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD "deletedAt" TIME WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "createdAt" TIME WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "updatedAt" TIME WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "deletedAt" TIME WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD "createdAt" TIME WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD "updatedAt" TIME WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD "deletedAt" TIME WITH TIME ZONE`,
    );
    await queryRunner.query(`ALTER TABLE "auth_code" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "auth_code" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "auth_code" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "auth_code" ADD "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "auth_code" DROP COLUMN "isActiveAt"`);
    await queryRunner.query(
      `ALTER TABLE "auth_code" ADD "isActiveAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW() + INTERVAL '1 hour'`,
    );
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "createdAt" TIME WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "updatedAt" TIME WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "deletedAt"`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "deletedAt" TIME WITH TIME ZONE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "answer" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "answer" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "answer" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "auth_code" DROP COLUMN "isActiveAt"`);
    await queryRunner.query(
      `ALTER TABLE "auth_code" ADD "isActiveAt" TIMESTAMP NOT NULL DEFAULT (now() + '01:00:00')`,
    );
    await queryRunner.query(`ALTER TABLE "auth_code" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "auth_code" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "auth_code" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "auth_code" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "file" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "file" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "file" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP COLUMN "createdAt"`,
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "question" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "question" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "question" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "tag" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "tag" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "tag" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "deletedAt"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "deletedAt" TIMESTAMP`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "updatedAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "updatedAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "createdAt"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "wasOnlineAt"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "wasOnlineAt" TIMESTAMP`);
  }
}
