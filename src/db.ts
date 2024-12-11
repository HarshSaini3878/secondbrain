import mongoose ,{Schema,Types} from "mongoose";

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
    },
}, {
    timestamps: true,
});

export const User = mongoose.model("User", UserSchema);




const contentTypes = ['youtube', 'twitter']; // Extend as needed

const contentSchema = new Schema({
  link: { type: String, required: true },
  type: { 
    type: String, 
    enum: contentTypes,  // Limiting possible values for the type field
    required: true 
  },
  title: { type: String, required: true },
  tags: [{ 
    type: Types.ObjectId, 
    ref: 'Tag'  // Referring to a Tag model
  }],
  userId: { 
    type: Types.ObjectId, 
    ref: 'User',  // Referring to the User model
    required: true 
  },
  authorId: {
    type: Types.ObjectId,
    ref: 'User'
  }
});


// Optionally, you can add methods or other schema options here

export const Content = mongoose.model('Content', contentSchema);



const tagSchema = new mongoose.Schema({
    title: { type: String, required: true, unique: true }
  });
  
 export const Tag = mongoose.model('Tag', tagSchema);


 const linkSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true,unique:true },
});
export const LinkModel = mongoose.model('Link', linkSchema);