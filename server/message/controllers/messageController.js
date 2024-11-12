const mongoose = require('mongoose');
const Message = require('../models/messageModel');

const getMessages = async (req, res) => {
    res.send('Get messages');
}

const postMessages = async (req, res) => {
    res.send('Post messages');
}

module.exports = {
    getMessages,
    postMessages
}