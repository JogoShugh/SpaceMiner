const {
  DB_PASSWORD,
  DB_HOST,
  DB_USERNAME,
  NODE_ENV,
} = process.env;

export default {
  db: {
    password: DB_PASSWORD,
    host: DB_HOST,
    username: DB_USERNAME,
  },
  env: NODE_ENV,
};
