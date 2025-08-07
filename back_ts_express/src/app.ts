import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import createError from 'http-errors';
import cors from 'cors';

import indexRouter from './routes/index';
import jokesRouter from './routes/jokes';
import databaseRouter from './routes/database';

const app = express();

app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', indexRouter);
app.use('/jokes', jokesRouter);
app.use('/database', databaseRouter);

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler // return JSON
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  // set status code
  const status = err.status || 500;
  
  // create error response
  const errorResponse: any = {
    message: err.message,
    status: status
  };
  
  // include stack trace in development
  if (req.app.get('env') === 'development') {
    errorResponse.stack = err.stack;
  }
  
  res.status(status).json(errorResponse);
});

export default app;