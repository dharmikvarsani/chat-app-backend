import Message from "../model/messageModel.js";
import User from "../model/userModel.js";
import cloudinary from '../lib/cloudinary.js'
import { getReciverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUser = await User.find({ _id: { $ne: loggedInUserId } }).select('-password')
        res.status(200).json(filteredUser)
    } catch (error) {
        console.log('error in getUserForSidebar', error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: usreToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: usreToChatId },
                { senderId: usreToChatId, receiverId: myId }
            ]
        })

        res.status(200).json(messages)

    } catch (error) {
        console.log('error in get messages controller', error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}


export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;

        if (image) {
            const uploadResponce = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponce.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();

        // Realtime chat with socket.io
        const receiverSocketId = getReciverSocketId(receiverId)
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage)
        }


        res.status(201).json(newMessage)

    } catch (error) {
        console.log('error in Send messages controller', error.message)
        return res.status(500).json({ message: 'Internal server error' })
    }
}