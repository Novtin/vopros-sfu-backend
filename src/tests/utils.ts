import { DataSource } from 'typeorm';

export async function clearDatabase(dataSource: DataSource) {
  for (const entity of dataSource.entityMetadatas) {
    if (entity.tableName !== 'role') {
      await dataSource.query(`TRUNCATE "${entity.tableName}" CASCADE;`);
    }
  }
}
