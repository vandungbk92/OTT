export default {
  async Message(req, res) {
    try {
      let bot = req.app.get('bot')

      bot.on('message', (msg) => {
        const chatId = msg.chat.id;

        // send a message to the chat acknowledging receipt of their message
        bot.sendMessage(chatId, 'Received your message');
      });

      //bot.sendMessage('766188315', messageTlg, {parse_mode : "HTML"});
      //return res.json({success: true});
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }

};
