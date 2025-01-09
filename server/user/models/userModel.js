const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePic: {
        type: String,
        default: ''
    },
    verified: {
        type: Boolean,
        default: false
    },
    active: {
        type: Boolean,
        default: false
    },
    socketId: {
        type: String,
        default: ''
    },
    lastActive: {
        type: Date,
        default: ''
    },
    contacts: [{
        type: schema.Types.ObjectId,
        ref: 'User'
    }]
},{
    timeStamps: true
});

module.exports = mongoose.model('User', userSchema);