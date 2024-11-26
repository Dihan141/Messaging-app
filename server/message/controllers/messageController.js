const mongoose = require('mongoose');
const Message = require('../models/messageModel');
const User = require('../../user/models/userModel');
const { getIo } = require('../../config/socket');

const getMessages = async (req, res) => {
    try {
        const uid = req.userId
        const receiverId = req.params.receiverId

        const messages = await Message.find({
            $or: [
                {senderId: uid, receiverId: receiverId},
                {senderId: receiverId, receiverId: uid}
            ]
        })

        res.status(200).json({ success: true, messages })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const postMessages = async (req, res) => {
    try {
        const { senderId, receiverId, content } = req.body;
        const message = new Message({
            senderId,
            receiverId,
            content
        });
    
        await message.save();

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        sender.contacts.addToSet(receiverId);
        receiver.contacts.addToSet(senderId);

        await sender.save();
        await receiver.save();

        const io = getIo();
        io.to(receiverId).emit('receiveMessage', message);

        res.status(201).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } 
}

module.exports = {
    getMessages,
    postMessages
}