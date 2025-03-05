require('dotenv/config');

export const sequelize = {
  dialect: process.env.DB_DIALECT,
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  define: {
    timestamps: true,
  },
  migrationStorage: 'sequelize',
  migrationStorageTableName: 'SequelizeMeta',
  migrations: ['database/migrations'],
};
