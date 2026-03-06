import express from 'express';
import cors from 'cors';
import { errorHandler } from '@/common/middleware/error.handler';
import { notFoundHandler } from '@/common/middleware/not-found';
import routes from '@/routes';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use('/api', routes);

app.use(notFoundHandler);

app.use(errorHandler);

export default app;
