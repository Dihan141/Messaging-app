require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./user/models/userModel')
const Connection = require('./connections/models/connectionsModel')

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log('Connected to MongoDB')
}).catch((err)=>{
    console.log(err);
});

const updateConnectionCollection = async() => {
    try {
        const users = await User.find()
        users.map(async (user) => {
            const connection = Connection({
                uid: user._id,
                approved: user.contacts,
                pending: [],
                blocked: []
            })

            await connection.save()
        })
        console.log('connections updated')
    } catch (error) {
        console.log(error)
    }
}

updateConnectionCollection()