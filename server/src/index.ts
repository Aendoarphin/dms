import express, { Request, Response, Application, Router } from 'express';
import dotenv from 'dotenv';

import userRouter from './app/routes/user';

const routes: { user: Router }= {
  user: userRouter,
}

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use('/user', userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://${process.env.HOST}:${process.env.PORT}`);
});