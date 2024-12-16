import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1734156605129 implements MigrationInterface {
  name = 'Migration1734156605129';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      "INSERT INTO \"user\" (email, \"passwordHash\", description, \"isConfirmed\", \"emailHash\", nickname) VALUES ('admin', '$argon2id$v=19$m=65536,t=3,p=4$L2Fz87UbxPq4dFxiZtqmvn/XkqJj90Nd/BJORRUIua4$7htufxRCd3iLRX31PpIKxI7LGa1QVPOEBRrAZoScoEo', 'Admin', TRUE, '', 'admin')",
    );
    await queryRunner.query(
      'INSERT INTO "user_role" ("userId", "roleId") VALUES ((SELECT id FROM "user" WHERE nickname = \'admin\'), (SELECT id FROM "role" WHERE name = \'admin\'))',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM "user_role" WHERE "userId" = (SELECT id FROM "user" WHERE nickname = \'admin\')',
    );
    await queryRunner.query('DELETE FROM "user" WHERE nickname = \'admin\'');
  }
}
