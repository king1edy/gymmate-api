// src/config/typeorm.config.ts
import { DataSource } from 'typeorm';
import 'reflect-metadata';
import * as fs from 'fs';
import * as path from 'path';

import { config } from 'dotenv';
import * as process from 'node:process';

config();

// export default new DataSource({
//   type: 'postgres',
//   host: process.env.DB_HOST || 'localhost',
//   port: parseInt(process.env.DB_PORT || '5432', 10),
//   username: process.env.DB_USERNAME,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_NAME || 'gymmate_dev',
//   ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
//   entities: ['src/**/*.entity.ts'],
//   migrations: ['src/migrations/*.ts'],
//   synchronize: false,
// });

const sslFlag = String(process.env.DB_SSL ?? 'true').toLowerCase() === 'true';
const strictSSL =
  String(process.env.DB_SSL_STRICT ?? 'true').toLowerCase() === 'true';

let ca: string | undefined;
if (process.env.DB_SSL_CA_PATH) {
  const p = path.resolve(process.env.DB_SSL_CA_PATH);
  ca = fs.readFileSync(p, 'utf8');
} else if (process.env.DB_SSL_CA_B64) {
  ca = Buffer.from(process.env.DB_SSL_CA_B64, 'base64').toString('utf8');
}

if (sslFlag && strictSSL && !ca) {
  throw new Error(
    'DB_SSL=true but no CA provided. Set DB_SSL_CA_PATH or DB_SSL_CA_B64.',
  );
}

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // absolutely no auto-sync in prod
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  entities: ['src/**/*.entity.ts'],
  // entities: [path.join(__dirname, '/**/*.entity.{ts,js}')],
  migrations: [path.join(__dirname, '/database/migrations/*.{ts,js}')],
  ssl: sslFlag
    ? {
        ca,
        rejectUnauthorized: strictSSL,
      }
    : undefined,
});

console.log('TypeORM CLI using entities glob:', AppDataSource.options.entities);

export default AppDataSource;
