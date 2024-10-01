import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Function to create a JWT token with expiration
const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' }); // Token expires in 7 days
};

// Register user
const registerUser = async (req, res) => {
    const { name, password } = req.body;
    const email = req.body.email.toLowerCase(); // Normalize email input

    try {
        // Checking if the user already exists
        const exist = await userModel.findOne({ email });
        if (exist) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        // Validating email format & strong password
        if (!validator.isEmail(email)) {
            return res.status(400).json({ success: false, message: "Please enter a valid email" });
        }

        if (!validator.isStrongPassword(password)) {
            return res.status(400).json({ success: false, message: "Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters" });
        }

        // Hashing user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Creating a new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword
        });

        const user = await newUser.save();

        // Creating a JWT token
        const token = createToken(user._id);

        res.status(201).json({ success: true, token });
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.log(error);
        }
        res.status(500).json({ success: false, message: "Error registering user" });
    }
};

// Login user
const loginUser = async (req, res) => {
    const email = req.body.email.toLowerCase(); // Normalize email input
    const { password } = req.body;

    try {
        // Checking if the user exists
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Comparing the password
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(400).json({ success: false, message: "Invalid email or password" });
        }

        // Creating a JWT token
        const token = createToken(user._id);

        res.status(200).json({ success: true, token });
    } catch (error) {
        if (process.env.NODE_ENV === 'development') {
            console.log(error);
        }
        res.status(500).json({ success: false, message: "Error logging in" });
    }
};

export { loginUser, registerUser };