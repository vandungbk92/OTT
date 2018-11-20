import jwt from 'jsonwebtoken';
import * as resquestAction from '../utils/responseAction';
import Citizen from '../resources/citizen/citizen.model';
import { getConfig } from '../../config/config';
import PassportJWT from 'passport-jwt';

const config = getConfig(process.env.NODE_ENV);

export default function (req, res, next) {
  let token = req.query.token || req.headers['token'];
  console.log(token)
  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, config.secret, function (err, decoded) {
      if (err) {
        resquestAction.error(res, 401, '');
      } else {
        // if everything is good, save to request for use in other routes
        console.log(decoded)
        req.decoded = decoded;
        next();
      }
    });
  } else {
    resquestAction.error(res, 401, '');
  }

}
