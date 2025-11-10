import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as morgan from 'morgan';
import { Logger, LogLevel } from './utils/winston_log';
import { errorHandler } from './middlewares/errorHandler';
import { sendBaseError } from './utils/response';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cors());
app.use(express.json());

app.use(
  morgan(`:method :url :status :res[content-length] - :response-time ms`, {
    stream: {
      write: (message) =>
        Logger({
          level: LogLevel.HTTP,
          message: message.trim(),
          label: 'USER_ACCESS_HANDLER',
        }),
    },
  })
);

app.get('/', function (req, res) {
  res.json({
    message: 'Application API Working Successfully  - 👋🌎🌍🌏',
  });
});

app.all('*', async (req, res) => {
  return sendBaseError(res, ['Api Route Not Found!'], 'Not Found', 404);
});

app.use(errorHandler);

export { app };
