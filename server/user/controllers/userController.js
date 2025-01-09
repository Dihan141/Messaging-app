const mongoose = require('mongoose')
const User = require('../models/userModel')

const updateUserCollection = async () => {
    try {
        await User.updateMany(
            {},
            { $set: {active: false, lastActive: new Date(), socketId: ''}, }
        )
        console.log('Profile pictures updated successfully')
    } catch (error) {
        console.error('Error updating profile pictures:', error)
    }
}

const getUsersBySearch = async (req, res) => {
    try {
        const { query } = req.params
    
        const users = await User.find({
            name: {
                $regex: `^${query}`,
                $options: 'i'
            }
        }).select('-password')

        if(users.length === 0){
            return res.status(200).json({msg: 'No match found', success: false})
        }

        res.status(200).json({users, success: true})
    } catch (error) {
        res.status(501).json({msg: 'Internal server error.', success: false, error: error.message});
    }       
    
}

const getContacts = async (req, res) => {
    try {
        console.log('get contacts')
        const { userId } = req
        const user = await User.findById(userId).populate('contacts', 'name email')

        console.log(user.contacts)

        res.status(200).json({contacts: user.contacts, success: true})
    } catch (error) {
        res.status(500).json({msg: 'Internal server error.', success: false, error: error.message});
    }
}

const getUserInfo = async (req, res) => {
    try {
        const { userId } = req.params
        const user = await User.findById(userId).select('name email')
        
        if(!user){
            return res.status(404).json({msg: 'User not found', success: false})
        }

        res.status(200).json({user, success: true})
    } catch (error) {
        res.status(500).json({msg: 'Internal server error.', success: false, error: error.message});
    }
}

module.exports = {
    getUsersBySearch,
    getContacts,
    getUserInfo
}
