import express from 'express';
import userOTTController from './userOTT.controller';

export const userOTTRouter = express.Router();


userOTTRouter.post('/', userOTTController.createOTTReq)
userOTTRouter.get('/', userOTTController.findAll);
