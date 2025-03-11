const Messages = require("../model/messageModel");
const CryptoJS = require("crypto-js");

const secretKey = process.env.SECRET_KEY;

module.exports.addMessage = async (req, res, next) => {
  try {
    const { from, to, message } = req.body;

    // Encrypting the message with AES (Advanced Encryption Standard)
    const encryptedMessage = CryptoJS.AES.encrypt(message,secretKey).toString();

    const data = await Messages.create({
      message: { text: encryptedMessage },
      users: [from, to],
      sender: from,
    });

    if (data) return res.json({ msg: "Message added successfully." });
    else return res.json({ msg: "Failed to add message to the database." });
  } catch (ex) {
    next(ex);
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const { from, to } = req.body;

    const messages = await Messages.find({
      users: {
        $all: [from, to],
      },
    }).sort({ updatedAt: 1 });

    const decryptedMessages = messages.map((msg) => {
      const bytes = CryptoJS.AES.decrypt(msg.message.text, secretKey);
      const originalText = bytes.toString(CryptoJS.enc.Utf8);
      return {
          fromSelf: msg.sender.toString() === from,
          message: originalText,
      };
    });

    res.json(decryptedMessages);
  } catch (ex) {
    next(ex);
  }
};