import express from 'express';
import passport from 'passport';
import facebookController from './facebook.controller';


export const facebookRouter = express.Router();

facebookRouter.get('/webhook', facebookController.Message);

