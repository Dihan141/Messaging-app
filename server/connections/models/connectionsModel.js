const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    connectionSender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    connectionReceiver: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Connection', connectionSchema);