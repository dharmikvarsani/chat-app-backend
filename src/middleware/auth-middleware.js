import jwt from 'jsonwebtoken'
import User from '../model/userModel.js'

export const protectedRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized Entery" })
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized Entery" })
        }

        const user = await User.findById(decoded.userId).select('-password')
        if (!user) {
            return res.status(404).json({ message: "User Not Found" })
        }

        req.user = user;
        next()

    } catch (error) {
        console.log("Error in auth middleware", error.message)
        return res.status(500).json({ message: "Internal srever error" })
    }
}

