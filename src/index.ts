import { app } from './app';
import envVars from '../env';
import { LogLevel, Logger } from './utils/winston_log';

const start = async () => {
  app.listen(envVars.PORT, () => {
    Logger({
      level: LogLevel.INFO,
      message: `App listening on port ${envVars.PORT}`,
      label: 'APP_START',
    });
  });
};

start();
