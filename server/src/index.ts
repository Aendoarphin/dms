import express, { Request, Response, Application, NextFunction } from 'express';
import dotenv from 'dotenv';
import { userRouter } from './app/routes/routes';

dotenv.config();

const app: Application = express();

app.use(express.json());
app.use('/auth/admin', userRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: "DMS API is running" });
})

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://${process.env.HOST}:${process.env.PORT}`);
});