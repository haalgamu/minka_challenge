import { DataSource } from 'typeorm';
import Entities from './entities';
import { InitRecords1662575536282 } from './migrations/1662575536282-InitRecords';
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || '127.0.0.1',
  port: parseInt(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'zef',
  entities: Entities,
  migrations: [InitRecords1662575536282],
  synchronize: true,
});
