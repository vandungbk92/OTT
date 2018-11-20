import express from 'express';
import passport from 'passport';
import telegramController from './telegram.controller';


export const telegramRouter = express.Router();
telegramRouter.get('', telegramController.Message);

