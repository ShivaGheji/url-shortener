import mongoose from "mongoose";

// temp
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 50,
    },
    email: {
      type: String,
      required: [true, "User Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      minLength: 2,
      maxLength: 255,
      match: [/\S+@\S+\.\S+/, "Please fill a valid email address"],
    },
    password: {
      type: String,
      required: [true, "User Password is required"],
      minLength: 6,
    },
  },
  { timestamps: true }
);

// mongoose method to hide some details by default
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

// temp
userSchema.methods.comparePassword = async function (candidatePwd) {
  return await bcrypt.compare(candidatePwd, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
