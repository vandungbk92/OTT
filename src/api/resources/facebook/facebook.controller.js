export default {
  async Message(req, res) {
    try {
      return res.json();
    } catch (err) {
      console.error(err);
      return res.status(500).send(err);
    }
  }

};
