const mongoose = require('mongoose');
const Message = require('../models/messageModel');
const User = require('../../user/models/userModel');
const { getIo } = require('../../config/socket');

async function updateProfilePics() {
  try {
      // Update all documents missing the 'profilePic' field
      await User.updateMany(
          { profilePic: { $exists: false } }, // Condition: if 'profilePic' doesn't exist
          { $set: { profilePic: '' } } // Set the default
      );
      console.log('Profile pictures updated successfully');
  } catch (error) {
      console.error('Error updating profile pictures:', error);
  }
}

const getMessages = async (req, res) => {
    try {
        const uid = req.userId
        const receiverId = req.params.receiverId

        const messages = await Message.find({
            $or: [
                {senderId: uid, receiverId: receiverId},
                {senderId: receiverId, receiverId: uid}
            ]
        })

        res.status(200).json({ success: true, messages })
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

const postMessages = async (req, res) => {
    try {
        const { senderId, receiverId, content, messageType } = req.body;

        const message = new Message({
            senderId,
            receiverId,
            content,
            messageType,
            audio: messageType === 'audio' ? req.file.path : null
        });
    
        await message.save();

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId);

        sender.contacts.addToSet(receiverId);
        receiver.contacts.addToSet(senderId);

        await sender.save();
        await receiver.save();

        const io = getIo();
        io.to(receiverId).emit('receiveMessage', message);

        res.status(201).json({ success: true, message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    } 
}

const getLastMessages = async (req, res) => {
    try {
        console.log(req.userId)
        const userId = new mongoose.Types.ObjectId(req.userId)

        const messages = await Message.aggregate([
            // Match messages involving the user
            {
              $match: {
                $or: [
                  { senderId: userId },
                  { receiverId: userId }
                ]
              }
            },
            // Sort messages by createdAt
            { $sort: { createdAt: -1 } },
            //grouping by sender and receiver
            {
                $group: {
                  _id: {
                    $cond: [
                      { $gt: ["$senderId", "$receiverId"] },
                      { sender: "$receiverId", receiver: "$senderId" },
                      { sender: "$senderId", receiver: "$receiverId" }
                    ]
                  },
                  lastMessage: { $first: "$$ROOT" }
                }
              },
              // Lookup for sender info
              {
                $lookup: {
                  from: "users",
                  localField: "lastMessage.senderId",
                  foreignField: "_id",
                  as: "senderInfo",
                  pipeline: [
                    { $project: { name: 1, email: 1, profilePic: 1 } }
                  ]
                }
              },
              // Lookup for receiver info
              {
                $lookup: {
                  from: "users",
                  localField: "lastMessage.receiverId",
                  foreignField: "_id",
                  as: "receiverInfo",
                  pipeline: [
                    { $project: { name: 1, email: 1, profilePic: 1 } }
                  ]
                }
              },
              // Project the fields we want, remove array wrapping for populated fields
              {
                $project: {
                  lastMessage: 1,
                  senderInfo: { $arrayElemAt: ["$senderInfo", 0] },
                  receiverInfo: { $arrayElemAt: ["$receiverInfo", 0] }
                }
              },
              // Sort by timestamp again if needed
              { $sort: { "lastMessage.createdAt": -1 } }
        ])

        res.status(200).json({ success:true, messages})
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

module.exports = {
    getMessages,
    postMessages,
    getLastMessages,
}