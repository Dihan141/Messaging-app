const mongoose = require('mongoose');
const Connection = require('../models/connectionsModel');

const getConnections = async (req, res) => {
    try {
        const connections = await Connection.find({
            $or: [
                { connectionSender: req.userId},
                { connectionReceiver: req.userId}
            ]
        })
        res.json({ success: true, connections });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    getConnections
}