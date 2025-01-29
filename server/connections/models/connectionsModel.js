const mongoose = require('mongoose');

const connectionSchema = new mongoose.Schema({
    uid: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    approved: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    pending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    blocked: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }]
}, { timestamps: true });

module.exports = mongoose.model('Connection', connectionSchema);