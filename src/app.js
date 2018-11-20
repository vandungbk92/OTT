import express from 'express';
import logger from 'morgan';
import { connect } from './config/db';
import { restRouter } from './api';
import bodyParser from 'body-parser';
import TelegramBot from 'node-telegram-bot-api'
import {ZaloOA} from 'zalo-sdk'
import request from 'request'
import {checkTempFolder, multipartMiddleware, downLoadAndSaveFile} from './api/utils/fileUtils';
import uuidV4 from 'uuid';
import fs from 'fs';
import * as AWS from 'ibm-cos-sdk';
import path from'path'
import requestOTTCtr from './api/resources/requestOTT/requestOTT.controller'

const app = express();
const PORT = process.env.PORT || 3001;

// Telegram
const tokenTelegram = '773001534:AAFHjeucDNpKDh6IBtI10Mk3dcsCVNxm4RA'
const botTelegram = new TelegramBot(tokenTelegram, {polling: true});

botTelegram.onText(/\/start/, (msg) => {

  botTelegram.sendMessage(msg.chat.id, "Welcome");

});


botTelegram.on('message', async (msg) => {
  console.log(msg)

  if(msg.text){
    await requestOTTCtr.createOTTReq(msg)
  }else if(msg.photo){
    let photos = msg.photo
    let file_id
    photos.filter(photo => {
      file_id = photo.file_id
    })

    let uri = 'https://api.telegram.org/bot' + tokenTelegram + '/getFile?file_id=' + file_id

      request({
      "uri": uri,
      "method": "GET",
    }, (err, res, body) => {
      if (!err) {
        body = JSON.parse(body)
        let file_name_full = body.result.file_path


        let file_name = path.basename(file_name_full)


        let extension = path.extname(file_name_full);
        let fileWithoutExtension  = path.basename(file_name_full,extension);
        let date_val = new Date()
        let timestam = date_val.getTime()
        let fileStorage = fileWithoutExtension + '_' + timestam + extension


        let filePath = 'https://api.telegram.org/file/bot' + tokenTelegram + '/' + file_name_full
        downLoadAndSaveFile(filePath, file_name, fileStorage)
        requestOTTCtr.createOTTReq(msg, fileStorage)
      }
    });
  }else if(msg.document){
    let document = msg.document
    let file_id = document.file_id
    let file_name = document.file_name

    let extension = path.extname(file_name);
    let fileWithoutExtension  = path.basename(file_name,extension);
    let date_val = new Date()
    let timestam = date_val.getTime()
    let fileStorage = fileWithoutExtension + '_' + timestam + extension

    console.log(file_id, fileStorage, file_name)

    let uri = 'https://api.telegram.org/bot' + tokenTelegram + '/getFile?file_id=' + file_id

    request({
      "uri": uri,
      "method": "GET",
    }, (err, res, body) => {
      if (!err) {
        body = JSON.parse(body)
        console.log(body, 'bodybody')
        let file_name_full = body.result.file_path

        let file_name = path.basename(file_name_full)
        let filePath = 'https://api.telegram.org/file/bot' + tokenTelegram + '/' + file_name_full
        downLoadAndSaveFile(filePath, file_name, fileStorage)
        requestOTTCtr.createOTTReq(msg, null, fileStorage)
      }
    })

  }

  /*let Hi = "hi";
  if (msg.text.toString().toLowerCase().indexOf(Hi) === 0) {
    botTelegram.sendMessage(msg.from.id, "Hello  " + msg.from.first_name);
  }
  let bye = "bye";
  if (msg.text.toString().toLowerCase().includes(bye)) {
    botTelegram.sendMessage(getUserProfilePhotos, "Hope to see you around again , Bye");
  }
  let robot = "I'm robot";
  if (msg.text.indexOf(robot) === 0) {
    botTelegram.sendMessage(msg.chat.id, "Yes I'm robot but not in that way!");
  }
  botTelegram.sendMessage(msg.chat.id, "Yes I'm robot but not in that way! 123");*/

  //let x = await botTelegram.getUserProfilePhotos(msg.chat.id)

  //let infoUser = await botTelegram.getChat(msg.chat.id)
  //let b = await botTelegram.getChatMember(msg.chat.id, msg.from.id)
  //let c = await botTelegram.setChatTitle(msg.chat.id, 'Tieu de')
  //console.log(infoUser, typeof infoUser)
  //console.log(b, typeof b)
  //console.log(x, typeof x)

  //botTelegram.sendLocation(msg.chat.id, 123, 123)
  //botTelegram.sendLocation(msg.chat.id,44.97108, -104.27719)
  //botTelegram.sendContact(msg.chat.id,'0339798180', 'Đinh')
  //console.log(botTelegram.getChat(msg.chat.id))

});

connect();
app.use(express.json());

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 1000000}));

app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
}

app.use('/api', restRouter);



// config zalo
let zsConfig = {
  oaid: '194569210228231281',
  secretkey: 'QGY17hVv1j6v5J38RHoU'
};
let ZOAClient = new ZaloOA(zsConfig);

// zalo
app.get('/zalo-webhook', (req, res) => {
  console.log(req.query)
  //Lấy thông tin người theo dõi
  ZOAClient.api('getprofile', { uid: '75779791630337998' }, function(response) {
    console.log(response)
    if(response.errorMsg === 'Success'){
      let data = response.data
      let userInfo = {
        userId: data.userId,
        displayName: data.displayName
      }

      // nếu tin nhắn dạng text.
      if(req.query.event === 'sendmsg'){
        requestOTTCtr.zaloOTTReq(userInfo, req.query.message)
      }else if(req.query.event === 'sendimagemsg'){

        let uri = req.query.href

        let file_name = path.basename(uri)

        let extension = path.extname(file_name);
        let fileWithoutExtension  = path.basename(file_name,extension);
        let date_val = new Date()
        let timestam = date_val.getTime()
        let fileStorage = fileWithoutExtension + '_' + timestam + extension

        console.log(uri, fileStorage, file_name, 'let file_name = path.basename(file_name_full)')
        downLoadAndSaveFile(uri, file_name, fileStorage)
        requestOTTCtr.zaloOTTReq(userInfo, '', fileStorage)

      }

      /*ZOAClient.api('sendmessage/text', 'POST', {uid: '75779791630337998', message: 'Wellcome to Thinklabs'}, (response) => {
        console.log(response)
      })*/
    }

  })

  /*let params = {
    phone: '01639798180',
    templateid: '12345',
    templatedata: {
      "content":"Chào bạn, Chúc bạn một ngày vui vẻ!"
    }
  }
  ZOAClient.api('sendmessage/phone/cs', 'POST', params, function(response) {
    console.log(response);
  })*/


  switch (req.query.event){
    // when user chat OA
    case 'sendmsg':
      let message = req.query.message;
      switch (message){
        case 'Hello':
          replyMessage(req.query.fromuid);
          break;
        case 'send image':
          replyImage(req.query.fromuid);
          break;
      }
  }
  res.sendStatus(200)
});
// kết thúc zalo


// facebook

const  tokenfb = 'EAAK8l9ZAn70QBABkzCahQy7eUkduc9zihgVf4JqtWLdcJYAEpBl1tqZBIwhM2Q7vVofdJDUZCgv7KYES9UejZAXOntysysDuZAhovdPtK1erHDA5ZCdZATZC13HCCZCCUkDYY5jLe5EkVzrA2ht8zMdGl0V9rexANVGZC69W2fIgBC3QZDZD'
app.get('/fb-webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "thinklabsjsc";

  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];

  // Checks if a token and mode is in the query string of the request
  if (mode && token) {

    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {

      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);

    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);
    }
  }
});

app.post('/fb-webhook', (req, res) => {

  /*let response = {
    "text": `Mã Id của bạn là ${body.object}`
  }
  callSendAPI('1778534825603335', response)*/
  let body = req.body;
  //console.log(body)
  let host = req.headers.host
  if (body.object === 'page') {
    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function (entry) {
      // Gets the message. entry.messaging is an array, but
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      //console.log(webhook_event, 'webhook_eventwebhook_event')

      // Get the sender PSID
      let sender_psid = webhook_event.sender.id;
      // Check if the event is a message or postback and
      // pass the event to the appropriate handler function
      if (webhook_event.message) {
        //console.log(webhook_event.message)
        handleMessage(sender_psid, webhook_event.message, host);
      } else if (webhook_event.postback) {
        // xử lý khi user chọn option từ template
        handlePostback(sender_psid, webhook_event.postback);
      }
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
  } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});

// Handles messages events
const handleMessage = (sender_psid, received_message) => {

  request({
    "uri": "https://graph.facebook.com/" + sender_psid + "?fields=name&access_token=" + tokenfb,
    "method": "GET",
  }, (err, res, body) => {
    if (!err) {
      body = JSON.parse(body)

      if(body && Object.keys(body).length){
        let userInfo = {
          userId: body.id,
          full_name: body.name
        }

        if(received_message.attachments){
          let attachments = received_message.attachments
          if(Array.isArray(attachments) && attachments.length){
            let dataUpload = attachments[0]
            let type = dataUpload.type
            let uri = dataUpload.payload.url

            let arrayUrl = uri.split( '?' )
            let arrayUrlOrigin = arrayUrl[0]

            let file_name = path.basename(arrayUrlOrigin)

            let extension = path.extname(file_name);
            let fileWithoutExtension  = path.basename(file_name,extension);
            let date_val = new Date()
            let timestam = date_val.getTime()
            let fileStorage = fileWithoutExtension + '_' + timestam + extension

            downLoadAndSaveFile(uri, file_name, fileStorage)


            if(type === 'image'){
              requestOTTCtr.facebookOTTReq(userInfo, '', fileStorage)
            }else if(type === 'file'){
              requestOTTCtr.facebookOTTReq(userInfo, '', '', fileStorage)
            }
          }

        }else if(received_message.text){
          requestOTTCtr.facebookOTTReq(userInfo, received_message.text)
        }
      }



    } else {
      console.error("Unable to send message:" + err);
    }
  });


  //console.log(sender_psid, received_message, 'sender_psid, received_message, host')

  let response;
  if (received_message.text) {
    //response = askTemplate('Thinklabs JSC');
    if (received_message.text === 'Thời tiết') {
      response = {
        "text": `thời tiết ở Thanh Hóa đẹp`
      }
    } else if (received_message.text === 'Giao Thông') {
      response = {
        "text": `Giao Thông không bị ùn tắc`
      }
    } else if (received_message.text === 'Đô Thị') {
      response = {
        "text": `Không có vấn đề về đô thị`
      }
    } else {
      response = {
        "text": `Chúc bạn ngày mới vui vẻ thinklabs JSC`
      }
    }
    // "text": `Mã Id của bạn là: "${sender_psid + ' ' + host}"`
    callSendAPI(sender_psid, response);
  }
}

//
const handlePostback = (sender_psid, received_postback) => {
  let response;
  // Get the payload for the postback
  let payload = received_postback.payload;
  if (payload === 'GET_STARTED') {
    response = 'Thinklabs JSC';
    callSendAPI(sender_psid, response);
  }
}

// Sends response messages via the Send API
const callSendAPI = (sender_psid, response, cb = null) => {
  // Construct the message body
  //console.log(sender_psid, response, 'sender_psidsender_psidsender_psid')
  let request_body = {
    "recipient": {
      "id": sender_psid
    },
    "message": response
  };
  // Send the HTTP request to the Messenger Platform
  request({
    "uri": "https://graph.facebook.com/v2.6/me/messages",
    "qs": {"access_token": tokenfb},
    "method": "POST",
    "json": request_body
  }, (err, res, body) => {
    if (!err) {
    } else {
      console.error("Unable to send message:" + err);
    }
  });
}


// kết thúc facebook


app.use((req, res, next) => {
  const error = new Error('Not found');
  error.message = 'Invalid route';
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  return res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is running at PORT http://localhost:${PORT}`);
});
