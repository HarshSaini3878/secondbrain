import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const app = express();
app.use(express.json());

const JWT_Secret: string = "radheradhe";

// Signin Route
app.post("/api/v1/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(403).json({
                message: "User not found"
            });
        }

        // Compare entered password with the stored hashed password
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(403).json({
                message: "Invalid credentials"
            });
        }

        // Create a JWT token after successful login
        const token = jwt.sign({ username: user.username, userId: user._id }, JWT_Secret, { expiresIn: "1h" });

        // Respond with success and token
        res.status(200).json({
            message: "User signed in successfully",
            user: {
                username: user.username
            },
            token: token
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

// Signup Route
app.post("/api/v1/signup", async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check if the username already exists
        const document = await User.findOne({ username: username });
        if (document) {
            return res.status(403).json({
                message: "Username already taken"
            });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the new user
        const user = await User.create({
            username: username,
            password: hashedPassword, // storing the hashed password
        });
        await user.save();

        // Create a JWT token after successful user creation
        const token = jwt.sign({ username: user.username, userId: user._id }, JWT_Secret, { expiresIn: "1h" });

        // Respond with success and token
        res.status(201).json({
            message: "User created successfully",
            user: {
                username: user.username
            },
            token: token
        });

    } catch (error: any) {
        console.error(error);
        res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});
