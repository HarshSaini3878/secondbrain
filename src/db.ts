import mongoose, { Schema, Types } from "mongoose";
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      trim: true,
      lowercase: true,  // Ensure usernames are stored in lowercase
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
  },
  {
    timestamps: true,
  }
);

// Password hashing before saving the user
UserSchema.pre('save', async function(next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords during login
UserSchema.methods.comparePassword = async function(password: string) {
  return await bcrypt.compare(password, this.password);
};

export const User = mongoose.model("User", UserSchema);
const contentTypes = ['Twitter', 'Youtube']; // Extend as needed

const contentSchema = new Schema(
  {
    link: { type: String, required: true },
    type: {
      type: String,
      enum: contentTypes, // Limiting the possible values for the type field
      required: true,
    },
    title: { type: String, required: true },
    tags: [
      {
        type: Types.ObjectId,
        ref: 'Tag', // Referring to a Tag model (ensure this is defined)
      },
    ],
    userId: {
      type: Types.ObjectId,
      ref: 'User', // Referring to a User model (ensure this is defined)
      required: true,
    },
    authorId: {
      type: Types.ObjectId,
      ref: 'User',
      required: false, // Optional field (author may not be specified)
    },
  },
  {
    timestamps: true,
  }
);

export const Content = mongoose.model('Content', contentSchema);

const tagSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
});

export const Tag = mongoose.model('Tag', tagSchema);

const linkSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

export const LinkModel = mongoose.model('Link', linkSchema);
