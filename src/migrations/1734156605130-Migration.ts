import { MigrationInterface, QueryRunner } from 'typeorm';
import * as fs from 'fs/promises';
import * as process from 'node:process';
import * as path from 'node:path';

export class Migration1734156605130 implements MigrationInterface {
  name = 'Migration1734156605130';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const filePaths = await fs.readdir(process.env.FILE_EXAMPLES_SAVE_PATH);

    const today = new Date();
    for (const filePath of filePaths) {
      const fileStat = await fs.stat(
        path.join(process.env.FILE_EXAMPLES_SAVE_PATH, filePath),
      );
      await queryRunner.query(
        `
         INSERT INTO "file" ("createdAt", "updatedAt", "deletedAt", name, size, mimetype) 
         VALUES ($1, $1, null, $2, $3, $4);
      `,
        [today, path.basename(filePath), fileStat.size, 'image/png'],
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'DELETE FROM "file" WHERE "name" ILIKE \'avatar%\';',
    );
  }
}
