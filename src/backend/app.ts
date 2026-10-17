import express from 'express';
import cookieParser from 'cookie-parser';
import { requestLogger } from './middlewares/request-logger.js';
import { errorHandler } from './middlewares/error-handler.js';
import { sessionMiddleware } from './middlewares/session-middleware.js';
import { sessionRouter } from './routes/session-routes.js';
import { evaluacionRouter } from './routes/evaluacion-routes.js';
import { umbralesRouter } from './routes/umbrales-routes.js';

export const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(requestLogger);

app.use('/api/session', sessionRouter);
app.use('/api/evaluacion', evaluacionRouter);
app.use('/api/umbrales', umbralesRouter);

app.use(errorHandler);
