const Admin = require("../Models/Admin");
const User = require("../Models/user");
const UserProgress = require("../Models/userProgress"); 
const bcrypt = require("bcrypt");

// Admin Registration
const RegisterAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (admin) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({ email, password: hashedPassword });

        await newAdmin.save();

        res.status(201).json({ message: "Admin registered successfully. Please log in." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// User Registration with UserProgress 
const RegisterUser = async (req, res) => {
    try {
        const { email, password, username } = req.body;
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: "Email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the new user
        const newUser = new User({ email, password: hashedPassword, username });
        await newUser.save();

        const progressDoc = new UserProgress({ user_id: newUser._id });
        await progressDoc.save();
        newUser.userProgress = progressDoc._id;
        await newUser.save();

        res.status(201).json({ message: "User registered successfully. Please log in." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { RegisterAdmin, RegisterUser };
