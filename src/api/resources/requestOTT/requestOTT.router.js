import express from 'express';
import passport from 'passport';
import requestOTTController from './requestOTT.controller';

export const requestOTTRouter = express.Router();


requestOTTRouter.post('/', requestOTTController.createOTTReq)
requestOTTRouter.get('/', requestOTTController.findAll);
