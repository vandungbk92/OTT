import express from 'express';
import { telegramRouter } from './resources/telegram/telegram.router';
import { requestOTTRouter } from './resources/requestOTT/requestOTT.router';
import { userOTTRouter } from './resources/userOTT/userOTT.router';


export const restRouter = express.Router();
restRouter.use('/telegram', telegramRouter);
restRouter.use('/request-ott', requestOTTRouter);
restRouter.use('/user-ott', userOTTRouter);






