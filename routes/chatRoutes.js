const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

// send message
router.post("/send", chatController.sendMessage);

// get messages
router.get("/:groupId", chatController.getMessages);

module.exports = router;