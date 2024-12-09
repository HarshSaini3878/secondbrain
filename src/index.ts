import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import chalk from 'chalk';
import { User,Content, LinkModel } from "./db";
import { isSignin } from "./middleware";
import { random } from "./utils";
interface IUser {
    _id: mongoose.Types.ObjectId;
    username: string;
    password: string;
    // Add any other fields from your User model as needed
  }
  interface RequestWithUser extends Request {
    user?: IUser;
  }
  
const app = express();
app.use(express.json());

const JWT_Secret: string = "radheradhe";

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

// Signin Route
app.post("/api/v1/signin", async (req: Request, res: Response):Promise<any>=> {
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
        return res.status(200).json({
            message: "User signed in successfully",
            user: {
                username: user.username
            },
            token: token
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

// Signup Route
app.post("/api/v1/signup", async (req: Request, res: Response): Promise<any> => {
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

        // Create a JWT token after successful user creation
        const token = jwt.sign({ username: user.username, userId: user._id }, JWT_Secret, { expiresIn: "1h" });

        // Respond with success and token
        return res.status(201).json({
            message: "User created successfully",
            user: {
                username: user.username
            },
            token: token
        });

    } catch (error: any) {
        console.error(error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
});

app.post('/api/v1/content', isSignin, async (req: RequestWithUser, res: Response): Promise<any> => {
    try {
      // Extract the data from the request body
      const { link, type, title, tags } = req.body;
  
      // Validate required fields
      if (!link || !type || !title || !tags) {
        return res.status(400).json({ message: 'Missing required fields.' });
      }
  
      // Create a new content document
      const newContent = new Content({
        link,
        type,
        title,
        tags: tags.map((tag: string) => new mongoose.Types.ObjectId(tag)), // Ensure tags are ObjectId type
        userId: req.user?._id, // Assuming `req.user` is set by the isSignin middleware
      });
  
      // Save the content to the database
      await newContent.save();
  
      // Return the created content as a response
      res.status(201).json({ message: 'Content created successfully', content: newContent });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error. Could not create content.' });
    }
  });


  app.get('/api/v1/content', isSignin, async (req: RequestWithUser, res: Response): Promise<any> => {
    try {
      // Retrieve the userId from the authenticated user (attached in the isSignin middleware)
      const userId = req.user?._id;
  
      // Fetch content associated with the authenticated user
      const contentList = await Content.find({ userId }).populate("userId","username");
  
      // Map the content list to the desired format
      const formattedContent = contentList.map(content => ({
        id: content._id.toString(), // Convert ObjectId to string
        type: content.type,
        link: content.link,
        title: content.title,
        tags: content.tags.map(tag => tag.toString()), 
        author:content.authorId.toString()// Convert ObjectId to string if necessary
      }));
  
      // Return the content in the required format
      res.status(200).json({ content: formattedContent });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error. Could not fetch content.' });
    }
  });


  app.delete('/api/v1/content', isSignin, async (req: RequestWithUser, res: Response): Promise<any> => {
    try {
      // Extract the contentId from the request body or query parameter
      const { contentId } = req.body;  // You can also use req.query or req.params if necessary
  
      // Validate contentId
      if (!contentId) {
        res.status(400).json({ message: 'Content ID is required.' });
        return;
      }
  
      // Ensure the content belongs to the authenticated user
      const content = await Content.findOne({ _id: contentId, userId: req.user?._id });
  
      // If content is not found or doesn't belong to the user, return an error
      if (!content) {
        res.status(404).json({ message: 'Content not found or you do not have permission to delete it.' });
        return;
      }
  
      // Delete the content
      await Content.deleteOne({ _id: contentId });
  
      // Return success response
      res.status(200).json({ message: 'Content deleted successfully.' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error. Could not delete content.' });
    }
  });

  app.post("/api/v1/brain/share", isSignin, async (req: RequestWithUser, res: Response): Promise<any> => {
    const share = req.body.share;
    if (share) {
            const existingLink = await LinkModel.findOne({
                userId: req.user._id
            });

            if (existingLink) {
                res.json({
                    hash: existingLink.hash
                })
                return;
            }
            const hash = random(10);
            await LinkModel.create({
                userId: req.user._id,
                hash: hash
            })

            res.json({
                hash
            })
    } else {
        await LinkModel.deleteOne({
            userId: req.user._id
        });

        res.json({
            message: "Removed link"
        })
    }
})

app.get("/api/v1/brain/:shareLink",async (req: RequestWithUser, res: Response): Promise<any> => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    // userId
    const content = await Content.find({
        userId: link.userId
    })

    console.log(link);
    const user = await User.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })

})












app.listen(8080, () => {
    console.log(chalk.blue("Server started at port 8080"));
});
