import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from './db'; // Ensure the path is correct

// Define an interface for the User model for better type safety
interface IUser {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  // Add any other fields from your User model as needed
}

const JWT_SECRET = 'radheradhe';  // Use environment variable for JWT secret

interface RequestWithUser extends Request {
  user?: IUser;
}

export const isSignin = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Get the token from the Authorization header (Bearer token)
    const token = req.headers["authorization"]?.split(" ")[1];

    // If no token is provided, return an error
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing.' });
    }

    // Ensure JWT_SECRET is defined
    if (!JWT_SECRET) {
      return res.status(500).json({ message: 'Server error: JWT_SECRET is not defined.' });
    }

    // Verify the token and decode it
    const decoded = jwt.verify(token, JWT_SECRET) as { _id: mongoose.Types.ObjectId };  // Decode the token to extract the user ID

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

    // More specific error messages for different cases
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Invalid token. Authentication failed.' });
    }
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token has expired. Please log in again.' });
    }
    return res.status(500).json({ message: 'Server error. Authentication failed.' });
  }
};
