import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from './db'; // Make sure the path to the User model is correct

// Define an interface for the User model (for better type safety)
interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  // Add any other fields from your User model as needed
}
const JWT_Secret: string = "radheradhe";
interface RequestWithUser extends Request {
  user?: IUser;
}

export const isSignin = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Get the token from the Authorization header (Bearer token)
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token is provided, return an error
    if (!token) {
      return res.status(401).json({ message: 'Please authenticate.' });
    }

    // Ensure the JWT_SECRET environment variable is defined
    
    if (!JWT_Secret) {
      return res.status(500).json({ message: 'Server error, JWT_SECRET is not defined.' });
    }

    // Verify the token and decode it
    const decoded = jwt.verify(token, JWT_Secret) as { _id: mongoose.Types.ObjectId };  // Decode the token to extract the user ID

    // Find the user by the decoded user ID
    const user = await User.findById(decoded._id);

    // If no user is found, return an error
    if (!user) {
      return res.status(401).json({ message: 'User not found. Please authenticate again.' });
    }

    // Attach the user to the request object for access in route handlers
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error(err);
    return res.status(401).json({ message: 'Authentication failed. Please try again.' });
  }
};
