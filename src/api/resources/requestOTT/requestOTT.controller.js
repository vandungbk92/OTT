import RequestOTT from './requestOTT.model';
import UserOTT from '../userOTT/userOTT.model';
import moment from 'moment'

export default {
  async createOTTReq(msg, images, files) {
    try {
      console.log(images, files, 'images, files')
      // tạo thông tin của user
      let infoUser = msg.chat
      console.log(infoUser.first_name, 'fisrt_name')
      console.log((infoUser.last_name ? (' ' + infoUser.last_name) : ''), 'last_name')

      let dataUser = {
        ott_type: 'telegram',
        document_id: infoUser.id,
        full_name: infoUser.first_name + (infoUser.last_name ? (' ' + infoUser.last_name) : ''),
        username: infoUser.username ? infoUser.username : '',
        link: infoUser.username ? 'https://t.me/' + infoUser.username : ''
      }

      let userOtt = await UserOTT.findOne({ott_type: 'telegram', document_id: infoUser.id})

      if(!userOtt || !Object.keys(userOtt).length){
        userOtt = await UserOTT.create(dataUser)
      }else{
        if(userOtt.full_name !== dataUser.full_name || userOtt.username !== dataUser.username){
          await UserOTT.findOneAndUpdate({ _id: userOtt._id }, dataUser)
        }
      }
      // kết thúc tạo hoặc cập nhật thông tin user.

      // tạo data request OTT
      let request = {
        user_ott_id: userOtt._id,
        content: msg.text ? msg.text : '',
        ott_type: 'telegram'
      }

      let date_val = new Date()

      let time_query = new Date(date_val.getTime() - 600*60000)
      let c = date_val.getTime()

      console.log(date_val.toISOString(), 'date_valdate_val')
      //console.log(b.toISOString(), 'date_valdate_val')
      console.log(c, 'date_valdate_val')

      let requestOTT = await RequestOTT.findOne({
        user_ott_id: userOtt._id,
        ott_type: 'telegram',
        created_at: {$gte : new Date(time_query)}
      })

      if(requestOTT){
        request.content = request.content ? requestOTT.content + '\n' + request.content : requestOTT.content
        request.images = images ? [...requestOTT.images, images] : requestOTT.images
        request.files = files ? [...requestOTT.files, files] : requestOTT.files

        console.log(request, 'requestrequestrequestrequest')
        await RequestOTT.findOneAndUpdate({ _id: requestOTT._id }, request)
      }else{
        await RequestOTT.create(request)
      }
    } catch (err) {
      console.error(err);
    }
  },

  async zaloOTTReq(userInfo, msg, images) {
    try {

      // tạo thông tin của user
      let dataUser = {
        ott_type: 'zalo',
        document_id: userInfo.userId,
        full_name: userInfo.displayName,
        username: '',
        link: 'https://zalo.me/' + userInfo.userId
      }

      let userOtt = await UserOTT.findOne({ott_type: 'zalo', document_id: userInfo.userId})

      if(!userOtt || !Object.keys(userOtt).length){
        userOtt = await UserOTT.create(dataUser)
      }else{
        if(userOtt.full_name !== dataUser.full_name){
          await UserOTT.findOneAndUpdate({ _id: userOtt._id }, dataUser)
        }
      }
      // kết thúc tạo hoặc cập nhật thông tin user.

      // tạo data request OTT
      let request = {
        user_ott_id: userOtt._id,
        content: msg ? msg : '',
        ott_type: 'zalo'
      }

      let date_val = new Date()
      let time_query = new Date(date_val.getTime() - 600*60000)
      let c = date_val.getTime()

      let requestOTT = await RequestOTT.findOne({
        user_ott_id: userOtt._id,
        ott_type: 'zalo',
        created_at: {$gte : new Date(time_query)}
      })

      if(requestOTT){
        request.content = request.content ? requestOTT.content + '\n' + request.content : requestOTT.content
        request.images = images ? [...requestOTT.images, images] : requestOTT.images

        await RequestOTT.findOneAndUpdate({ _id: requestOTT._id }, request)
      }else{
        await RequestOTT.create(request)
      }
    } catch (err) {
      console.error(err);
    }
  },

  async facebookOTTReq(userInfo, msg, images, files) {
    try {

      // tạo thông tin của user
      let dataUser = {
        ott_type: 'facebook',
        document_id: userInfo.userId,
        full_name: userInfo.full_name,
        username: '',
        link: ''
      }

      let userOtt = await UserOTT.findOne({ott_type: 'facebook', document_id: userInfo.userId})

      if(!userOtt || !Object.keys(userOtt).length){
        userOtt = await UserOTT.create(dataUser)
      }else{
        if(userOtt.full_name !== dataUser.full_name){
          await UserOTT.findOneAndUpdate({ _id: userOtt._id }, dataUser)
        }
      }
      // kết thúc tạo hoặc cập nhật thông tin user.

      // tạo data request OTT
      let request = {
        user_ott_id: userOtt._id,
        content: msg ? msg : '',
        ott_type: 'facebook'
      }

      let date_val = new Date()
      let time_query = new Date(date_val.getTime() - 600*60000)

      let requestOTT = await RequestOTT.findOne({
        user_ott_id: userOtt._id,
        ott_type: 'facebook',
        created_at: {$gte : new Date(time_query)}
      })

      if(requestOTT){
        request.content = request.content ? requestOTT.content + '\n' + request.content : requestOTT.content
        request.images = images ? [...requestOTT.images, images] : requestOTT.images
        request.files = files ? [...requestOTT.files, files] : requestOTT.files

        await RequestOTT.findOneAndUpdate({ _id: requestOTT._id }, request)
      }else{
        await RequestOTT.create(request)
      }
    } catch (err) {
      console.error(err);
    }
  },


  async findAll(req, res) {
    try {
      //await RequestOTT.remove({})
      const requestOTT = await RequestOTT.find({})
      return res.json(requestOTT);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
  async createOTT(req, res) {
    try {
      const requestOTT = await requestOTT.paginate()
      return res.json(requestOTT);
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  },
};
