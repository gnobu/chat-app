const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");

// const accessChat = expressAsyncHandler(async (req, res) => {
//     const { userId } = req.body;

//     if (!userId) {
//         console.log('User ID not sent with request');
//         return res.sendStatus(400);
//     }

//     let isChat = await Chat.find
// })