const Connection = require('../models/connectionsModel');

const getConnection = async (req, res) => {
    try {
        const { id } = req.params
        const connection = await Connection.findOne({ uid: id })
        res.status(200).json({ success: true, connection })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const pendingUser = async (req, res) => {
    try {
        const { otherUid } = req.body
        const connection = await Connection.findOne({ uid: req.userId })

        if(connection.approved.includes(otherUid)){
            const filteredaApprovedList = connection.approved.filter(id => id != otherUid)
            connection.approved = filteredaApprovedList
        }

        if(connection.pending.includes(otherUid)){
            return res.status(200).json({ success: false, message: 'user already in pending'})
        }
        
        connection.pending.push(otherUid)

        await connection.save()

        res.status(200).json({ success: true, connection })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const acceptUser = async (req, res) => {
    try {
        const { otherUid } = req.body
        const connection = await Connection.findOne({ uid: req.userId })

        if(connection.pending.includes(otherUid)){
            const filteredPendingList = connection.pending.filter(id => id != otherUid)
            console.log(filteredPendingList)
            connection.pending = filteredPendingList
        }
        
        if(connection.approved.includes(otherUid)){
            return res.status(200).json({ success: false, message: 'user already in approved list'})
        }

        connection.approved.push(otherUid)

        await connection.save()

        res.status(200).json({ success: true, connection })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const unblockUser = async (req, res) => {
    try {
        const { otherUid } = req.body
        const connection = await Connection.findOne({ uid: req.userId })

        if(connection.pending.includes(otherUid)){
            const filteredPendingList = connection.pending.filter(id => id != otherUid)
            connection.pending = filteredPendingList
        }
        
        if(connection.approved.includes(otherUid)){
            return res.status(200).json({ success: false, message: 'user already in approved list'}) 
        }

        if(connection.blocked.includes(otherUid)){
            const filteredBlockList = connection.blocked.filter(id => id != otherUid)
            connection.blocked = filteredBlockList
        }

        connection.approved.push(otherUid)

        await connection.save()

        res.status(200).json({ success: true, connection })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

const blockUser = async (req, res) => {
    try {
        const { otherUid } = req.body
        const connection = await Connection.findOne({ uid: req.userId })

        if(connection.pending.includes(otherUid)){
            const filteredPendingList = connection.pending.filter(id => id != otherUid)
            connection.pending = filteredPendingList
        }
        
        if(connection.approved.includes(otherUid)){
            const filteredaApprovedList = connection.approved.filter(id => id != otherUid)
            connection.approved = filteredaApprovedList
        }

        if(connection.blocked.includes(otherUid)){
            return res.status(200).json({ success: false, message: 'user already in blocked list'}) 
        }

        connection.blocked.push(otherUid)

        await connection.save()

        res.status(200).json({ success: true, connection })
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
}

module.exports = {
    getConnection,
    pendingUser,
    acceptUser,
    blockUser,
    unblockUser
}