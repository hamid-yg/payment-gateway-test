export default () => ({
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT, 10),
  logLevel: process.env.LOGLEVEL,
  databaseUrl: process.env.DATABASE_URI,
  paymentApiUrl: process.env.PAYMENT_API_URL,
});
