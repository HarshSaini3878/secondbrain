import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import chalk from 'chalk';
import { User, Content, LinkModel } from "./db";
import { isSignin } from "./middleware";
import { random } from "./utils";
import cors from "cors";

interface IUser {
    _id: mongoose.Types.ObjectId;
    username: string;
    password: string;
}

interface RequestWithUser extends Request {
    user?: IUser;
}

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET: string = "radheradhe";

// Connect to MongoDB with async/await
const connectDB = async (): Promise<void> => {
    try {
        await mongoose.connect('mongodb://localhost:27017/secondbrain');
        console.log(chalk.greenBright('Connected to MongoDB successfully!'));
    } catch (error: any) {
        console.error(chalk.red('Error connecting to MongoDB:', error.message));
        process.exit(1); // Exit the process if the connection fails
    }
};

// Call the async function to connect
connectDB();

// Helper function to generate JWT token
const generateToken = (user: IUser): string => {
    return jwt.sign({ username: user.username, userId: user._id }, JWT_SECRET, { expiresIn: "1h" });
};

// Signin Route
app.post("/api/v1/signin", async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(403).json({ message: "User not found" });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(403).json({ message: "Invalid credentials" });
        }

        const token = generateToken(user);

        return res.status(200).json({
            message: "User signed in successfully",
            user: { username: user.username },
            token
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Signup Route
app.post("/api/v1/signup", async (req: Request, res: Response): Promise<any> => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(403).json({ message: "Username already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            username,
            password: hashedPassword
        });

        const token = generateToken(user);

        return res.status(201).json({
            message: "User created successfully",
            user: { username: user.username },
            token
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
});

// Create Content Route
app.post('/api/v1/content', isSignin, async (req: RequestWithUser, res: Response): Promise<any> => {
    const { link, type, title, tags } = req.body;

    try {
        if (!link || !type || !title || !tags || !Array.isArray(tags)) {
            return res.status(400).json({ message: 'Missing or invalid required fields.' });
        }

        const validatedTags = tags.map((tag: string) => {
            if (!mongoose.Types.ObjectId.isValid(tag)) {
                throw new Error(`Invalid tag ID: ${tag}`);
            }
            return new mongoose.Types.ObjectId(tag);
        });

        const newContent = new Content({
            link,
            type,
            title,
            tags: validatedTags,
            userId: req.user?._id,
        });

        await newContent.save();

        return res.status(201).json({
            message: 'Content created successfully',
            content: newContent
        });

    } catch (err: any) {
        console.error(err);
        if (err.message && err.message.startsWith('Invalid tag ID:')) {
            return res.status(400).json({ message: err.message });
        }
        return res.status(500).json({ message: 'Server error. Could not create content.' });
    }
});

// Get Content Route
app.get('/api/v1/content', isSignin, async (req: RequestWithUser, res: Response): Promise<any> => {
    try {
        const userId = req.user?._id;

        const contentList = await Content.find({ userId }).populate("userId", "username");

        const formattedContent = contentList.map(content => ({
            id: content._id.toString(),
            type: content.type,
            link: content.link,
            title: content.title,
            tags: content.tags.map(tag => tag.toString()),
            author: content.userId?.username // Assuming content.userId is populated
        }));

        res.status(200).json({ content: formattedContent });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Could not fetch content.' });
    }
});

// Delete Content Route
app.delete('/api/v1/content', isSignin, async (req: RequestWithUser, res: Response): Promise<any> => {
    const { contentId } = req.body;

    try {
        if (!contentId) {
            return res.status(400).json({ message: 'Content ID is required.' });
        }

        const content = await Content.findOne({ _id: contentId, userId: req.user?._id });

        if (!content) {
            return res.status(404).json({ message: 'Content not found or you do not have permission to delete it.' });
        }

        await Content.deleteOne({ _id: contentId });

        res.status(200).json({ message: 'Content deleted successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error. Could not delete content.' });
    }
});

// Share Content Route
app.post("/api/v1/brain/share", isSignin, async (req: RequestWithUser, res: Response): Promise<any> => {
    const { share } = req.body;

    if (share) {
        const existingLink = await LinkModel.findOne({ _id: req.user._id });

        if (existingLink) {
            return res.json({ hash: existingLink.hash });
        }

        const hash = random(10);
        await LinkModel.create({
            _id: req.user._id,
            hash
        });

        return res.json({ hash });
    } else {
        await LinkModel.deleteOne({ _id: req.user._id });
        return res.json({ message: "Removed link" });
    }
});

// Get Shared Content by Link
app.get("/api/v1/brain/:shareLink", async (req: RequestWithUser, res: Response): Promise<any> => {
    const { shareLink } = req.params;

    const link = await LinkModel.findOne({ hash: shareLink });

    if (!link) {
        return res.status(411).json({ message: "Invalid share link" });
    }

    const content = await Content.find({ userId: link.userId });

    const user = await User.findOne({ _id: link.userId });

    if (!user) {
        return res.status(411).json({ message: "User not found, error should ideally not happen" });
    }

    res.json({
        username: user.username,
        content
    });
});

// Start the server
app.listen(8080, () => {
    console.log(chalk.blue("Server started at port 8080"));
});
