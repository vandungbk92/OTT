import UserOTT from './userOTT.model';
import moment from 'moment'

export default {
  async createOTTReq(msg, infoUser) {
    try {

    } catch (err) {

    }
  },
  async findAll(req, res) {
    try {
      //await UserOTT.remove({})
      let a = await UserOTT.find({})
      return res.json(a)
    } catch (err) {

    }
  },
  async createOTT(req, res) {
    try {
    } catch (err) {

    }
  },
};
