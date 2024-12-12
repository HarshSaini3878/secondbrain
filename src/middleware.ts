import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from './db.js'; // Ensure the path to the User model is correct

// Define an interface for the User model (for better type safety)
interface IUser {
  userId: mongoose.Types.ObjectId; // Use userId if it's the key in your token
  username: string;
  password: string;
  // Add any other fields from your User model as needed
}

const JWT_SECRET: string = process.env.JWT_SECRET || "radheradhe"; // Get the secret from environment variables

interface RequestWithUser extends Request {
  user?: IUser;
}

export const isSignin = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Get the token from the Authorization header (Bearer token)
    const token = req.headers["authorization"] as string;

    // If no token is provided, return an error
    if (!token) {
      return res.status(401).json({ message: 'Please authenticate.' });
    }

    

    // Verify the token and decode it
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: mongoose.Types.ObjectId }; // Assuming token has userId
   

    // Find the user by the decoded userId
    const user = await User.findById(decoded.userId); // Use userId to find the user
    console.log("user:", user);

    // If no user is found, return an error
    if (!user) {
      return res.status(401).json({ message: 'User not found. Please authenticate again.' });
    }

    // Attach the user to the request object for access in route handlers
    //@ts-ignore
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Authentication failed. Please try again.' });
  }
};
