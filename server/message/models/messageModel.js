const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    messageType: {
        type: String,
        default: 'text'
    },
    content : {
        type: String,
    },
    audio: {
        type: String
    },
    read: {
        type: Boolean,
        default: false
    }
}, {timestamps: true});

module.exports = mongoose.model('Message', messageSchema);