import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import * as morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { Logger, LogLevel } from './utils/winston_log';
import { errorHandler } from './middlewares/errorHandler';
import { sendBaseError } from './utils/response';
import { applicationRouters } from './modules';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

app.use(cors());
app.use(express.json());

// Set up rate limiter: maximum of 5 requests per 1 minute per IP
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 requests per `window` (here, per 1 minute)
  handler: (req, res) => {
    return sendBaseError(
      res,
      ['Rate limit exceeded'],
      'You have exceeded the number of allowed requests. Please try again later.',
      429
    );
  },
});

// Apply the rate limiter to all requests
app.use(limiter);

// HTTP request logger middleware
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

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static('uploads'));
// Application Routes
app.use('/', applicationRouters);
// 404 Handler for undefined routes
app.all(/.*/, async (req, res) => {
  return sendBaseError(res, ['Api Route Not Found!'], 'Not Found', 404);
});
// Global Error Handler
app.use(errorHandler);

export { app };
