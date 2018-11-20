import express from 'express';
import passport from 'passport';
import zaloController from './zalo.controller';


export const zaloRouter = express.Router();

zaloRouter.get('/webhook', zaloController.Message);

