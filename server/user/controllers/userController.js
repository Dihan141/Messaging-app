const mongoose = require('mongoose')
const User = require('../models/userModel')

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

module.exports = {
    getUsersBySearch
}
