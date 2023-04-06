import Database from './database';
import app from './app';

const database = new Database();

const port = app.get('port');

/**
 * Database connection
 * It call Databse API Service which connects the Databse from the given credentials.
 */
(async function () {
  try {
    await database.connect();
    app.listen(port, () => {
      console.info(`Server started - PORT: ${port}`);
    });
  } catch (error) {
    console.log('Unable to connect to database. ', error);
  }
})();

/**
 * Terminate process and connection with the Database when server shut down.
 */
process.on('SIGINT', async () => {
  console.info('Gracefully shutting down');
  await database.disConnect();
  process.exit(0);
});
