const Admin = require("../Models/Admin");
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const ADMIN_TOKEN_EXPIRATION = "2h"; 
const USER_TOKEN_EXPIRATION = "1h";  

// Generate JWT Token
const generateToken = (userId, role) => {
    const expiresIn = role === "admin" ? ADMIN_TOKEN_EXPIRATION : USER_TOKEN_EXPIRATION;
    return jwt.sign({ userId, role }, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        return null; 
    }
};

// Admin Login 
const loginAdmin = async (req, res) => {
    try {
        const { email, password, token } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin) return res.status(401).json({ message: "Email or password is incorrect" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ message: "Email or password is incorrect" });

        if (!token) {
            const newToken = generateToken(admin._id, "admin");
            return res.status(200).json({ message: "Admin logged in successfully", token: newToken });
        }

        const decoded = verifyToken(token);
        if (decoded && decoded.userId === admin._id.toString()) {
            return res.status(200).json({ message: "Admin logged in successfully", token });
        }

        const newToken = generateToken(admin._id, "admin");
        res.status(200).json({ message: "Admin logged in successfully", token: newToken });

    } catch (error) {
        console.error("Error in Admin login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

//  User Login 
const loginUser = async (req, res) => {
    try {
        const { email, password, token } = req.body;
        const user = await User.findOne({ email });

        if (!user) return res.status(401).json({ message: "Email or password is incorrect" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Email or password is incorrect" });

        if (!token) {
            const newToken = generateToken(user._id, "user");
            return res.status(200).json({ message: "User logged in successfully", token: newToken });
        }

        const decoded = verifyToken(token);
        if (decoded && decoded.userId === user._id.toString()) {
            return res.status(200).json({ message: "User logged in successfully", token });
        }

        const newToken = generateToken(user._id, "user");
        res.status(200).json({ message: "User logged in successfully", token: newToken });

    } catch (error) {
        console.error("Error in User login:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { loginAdmin, loginUser };
